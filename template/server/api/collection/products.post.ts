import { z } from 'zod'

export default defineEventHandler(async (event) => {
    const variables = await readValidatedBody(event, z.object({
        handle: z.string(),
        filters: productFilterSchema.optional(),
    }).merge(connectionParamsSchema).merge(localizationParamsSchema).parse)

    const storefront = useStorefront()

    const { data } = await storefront.request(`#graphql
        query FetchListing(
            $handle: String,
            $after: String,
            $before: String,
            $first: Int,
            $last: Int,
            $reverse: Boolean,
            $sortKey: ProductCollectionSortKeys,
            $filters: [ProductFilter!],
            $language: LanguageCode,
            $country: CountryCode
        )
        @inContext(language: $language, country: $country) {
            collection(handle: $handle) {
                products(
                    after: $after,
                    before: $before,
                    first: $first,
                    last: $last,
                    reverse: $reverse,
                    sortKey: $sortKey,
                    filters: $filters
                ) {
                    ...ProductConnectionFields
                }
            }
        }
        ${IMAGE_FRAGMENT}
        ${PRICE_FRAGMENT}
        ${PRODUCT_CONNECTION_FRAGMENT}
    `, {
        variables,
    })

    return data
})
