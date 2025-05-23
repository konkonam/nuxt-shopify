<script setup lang="ts">
import type { FetchCollectionsQuery } from '#shopify/storefront'
import type { NavigationMenuItem } from '#ui/types'

const props = defineProps<{
    collections: FetchCollectionsQuery['collections']['edges']
}>()

const searchInitialized = ref(false)
const searchOpen = ref(false)

const menuOpen = ref(false)

const collections = computed<NavigationMenuItem[]>(() => props.collections
    .map(collection => ({
        label: collection.node.title,
        to: getCollectionAppUrl(collection.node.handle),
    })))

const navigationItems = computed<NavigationMenuItem[]>(() => collections.value
    .map(collection => ({
        ...collection,
        class: 'px-3 hidden lg:block hover:text-primary',
    })).splice(0, 4))

const navigationActions = computed<NavigationMenuItem[]>(() => [
    {
        icon: icons.account,
        class: 'cursor-pointer px-2 sm:px-3',
        to: getAccountAppUrl(),
    },
    {
        icon: icons.cart,
        class: 'cursor-pointer px-2 sm:px-3',
        to: getCartAppUrl(),
    },
    {
        icon: icons.menu,
        class: 'cursor-pointer px-2 sm:px-3 lg:hidden',
        active: menuOpen.value,
        onSelect: () => menuOpen.value = !menuOpen.value,
    },
])

watch(searchOpen, () => searchInitialized.value = true)
</script>

<template>
    <div class="border-b border-[var(--ui-border-muted)] relative z-10 shadow-xs">
        <UContainer class="flex flex-row justify-evenly items-center">
            <Logo />

            <UNavigationMenu
                highlight
                highlight-color="primary"
                orientation="horizontal"
                :items="navigationItems"
                class="grow"
            />

            <SearchButton
                v-model="searchOpen"
                class="px-2 sm:mr-6 xl:mr-8"
            />

            <UNavigationMenu
                highlight
                highlight-color="primary"
                orientation="horizontal"
                :items="navigationActions"
            />
        </UContainer>

        <NavigationMenu
            v-model="menuOpen"
            :collections="collections"
        />

        <LazySearchMenu
            v-if="searchInitialized"
            v-model="searchOpen"
        />
    </div>
</template>
