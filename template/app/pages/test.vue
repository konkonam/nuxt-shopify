<script type="setup" setup lang="ts">
const storefront = useStorefront()

const { data, errors } = await storefront.request(`#graphql
    query FetchCollectionsInFrontend($after: String, $before: String, $first: Int, $last: Int, $language: LanguageCode, $country: CountryCode)
        @inContext(language: $language, country: $country) {
            collections(
                after: $after
                before: $before
                first: $first
                last: $last
            ) {
                ...CollectionConnectionFields
            }
        }
        ${IMAGE_FRAGMENT}
        ${COLLECTION_FRAGMENT}
        ${COLLECTION_CONNECTION_FRAGMENT}
`, {
    variables: {
        first: 3,
        country: 'US',
        language: 'EN',
    },
})
</script>

<template>
    <div>
        <pre>{{ data }}</pre>
        <pre>{{ errors }}</pre>
    </div>
</template>
