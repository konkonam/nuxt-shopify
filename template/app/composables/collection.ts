export const useCollection = () => {
    const { country, language } = useMarket()
    const { filters } = useFilters()
    const route = useRoute()

    const before = computed(() => route.query.before ? String(route.query.before) : undefined)
    const after = computed(() => route.query.after ? String(route.query.after) : undefined)

    const first = computed(() => route.query.last ? undefined : Number(route.query.first ?? 12))
    const last = computed(() => route.query.last ? Number(route.query.last ?? 12) : undefined)

    const sortKey = computed(() => route.query.sortKey ? String(route.query.sortKey) : undefined)
    const reverse = computed(() => route.query.reverse ? Boolean(route.query.reverse) : undefined)

    const params = computed(() => ({
        before: before.value,
        after: after.value,
        first: first.value,
        last: last.value,
        sortKey: sortKey.value,
        reverse: reverse.value,
        filters: filters.value,
        language: language.value,
        country: country.value,
    }))

    return {
        params,
        before,
        after,
        first,
        last,
        sortKey,
        reverse,
        filters,
    }
}
