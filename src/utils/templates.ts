import type { Nuxt, NuxtTemplate } from '@nuxt/schema'
import type {
    ShopifyClientConfig,
    ShopifyTemplateOptions,
} from '../types'

import { readFile } from 'node:fs/promises'
import { dirname, basename, join } from 'node:path'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import {
    addTemplate,
    addTypeTemplate,
    updateTemplates,
} from '@nuxt/kit'
import defu from 'defu'
import { minimatch } from 'minimatch'
import { kebabCase } from 'scule'

import customerAccountSchema from '@shopify/hydrogen-react/customer-account.schema.json'

import {
    ShopifyClientType,
} from './config'
import {
    generateIntrospection,
    generateOperations,
    generateTypes,
} from './codegen'

export function setupWatcher(nuxt: Nuxt, template: NuxtTemplate<ShopifyTemplateOptions>) {
    nuxt.hook('builder:watch', async (_event, file) => {
        for (const document of template.options?.clientConfig?.documents ?? []) {
            if (!minimatch(file, document)) continue

            const content = await readFile(join(nuxt.options.srcDir, file), 'utf8')
                .catch(() => '')

            if (
                file.endsWith('.gql')
                || file.endsWith('.graphql')
                || content.includes('#graphql')
                || content.includes('/* GraphQL */')
            ) {
                return updateTemplates({
                    filter: t => t.filename === template.options?.filename,
                })
            }
        }
    })
}

export function registerTemplates<T extends ShopifyClientType>(nuxt: Nuxt, clientType: T, clientConfig: ShopifyClientConfig) {
    const introspectionFilename = `schema/${kebabCase(clientType)}.schema.json`
    const introspectionPath = join(nuxt.options.buildDir, introspectionFilename)

    if (clientType === ShopifyClientType.CustomerAccount && !existsSync(introspectionPath)) {
        mkdirSync(dirname(introspectionPath), { recursive: true })
        writeFileSync(introspectionPath, JSON.stringify(customerAccountSchema))
    }

    const introspection = addTemplate<ShopifyTemplateOptions>({
        filename: introspectionFilename,
        getContents: generateIntrospection,
        options: {
            filename: introspectionFilename,
            clientType,
            clientConfig,
            introspection: introspectionPath,
        },
        write: true,
    })

    const typesFilename = `types/${kebabCase(clientType)}/${kebabCase(clientType)}.types`
    const types = addTypeTemplate<ShopifyTemplateOptions>({
        filename: `${typesFilename}.d.ts`,
        getContents: generateTypes,
        options: {
            filename: `${typesFilename}.d.ts`,
            clientType,
            clientConfig,
            introspection: introspection.dst,
        },
    })

    const operationsFilename = `types/${kebabCase(clientType)}/${kebabCase(clientType)}.operations`
    const operations = addTypeTemplate<ShopifyTemplateOptions>({
        filename: `${operationsFilename}.d.ts`,
        getContents: generateOperations,
        options: {
            clientType,
            clientConfig,
            filename: `${operationsFilename}.d.ts`,
            introspection: introspection.dst,
        },
    })

    setupWatcher(nuxt, operations)

    const index = addTypeTemplate<ShopifyTemplateOptions>({
        filename: `types/${kebabCase(clientType)}/index.d.ts`,
        getContents: () => `export * from './${basename(types.filename)}'\nexport * from './${basename(operations.filename)}'\n`,
    })

    nuxt.options = defu(nuxt.options, {
        alias: { [`#shopify/${kebabCase(clientType)}`]: dirname(index.filename) },
        nitro: {
            typescript: {
                tsConfig: {
                    include: [index.filename],
                },
            },
        },
    })
}
