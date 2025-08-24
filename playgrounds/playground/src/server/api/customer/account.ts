export default defineEventHandler(async () => {
    const customerAccount = useCustomerAccount()

    return await customerAccount.request(`#graphql
        query CustomerDetails {
            customer {
                ...CustomerFields
            }
        }
        ${CUSTOMER_FRAGMENT}
    `)
})
