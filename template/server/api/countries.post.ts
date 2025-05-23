export default defineEventHandler(async (event) => {
    const variables = await readValidatedBody(event, localizationParamsSchema.parse)

    const storefront = useStorefront()

    const { data, errors } = await storefront.request(`#graphql
        query FetchCountries($language: LanguageCode, $country: CountryCode) 
        @inContext(language: $language, country: $country) {
            localization {
                availableCountries {
                    isoCode
                    name

                    availableLanguages {
                        isoCode
                    }

                    currency {
                        isoCode
                        symbol
                    }
                }
            }
        }
    `, {
        variables,
    })

    if (errors) throw createError(errors)

    return data
})
