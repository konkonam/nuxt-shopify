export default defineEventHandler(async () => {
    const customerAccount = useCustomerAccount()

    const { data: customer } = await customerAccount.request(`#graphql
        query CustomerDetails {
            customer {
                ...CustomerFields
            }
        }
        ${CUSTOMER_FRAGMENT}
    `)

    return customer
})
