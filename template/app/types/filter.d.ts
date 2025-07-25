export type UpdateFilterFn = <T extends keyof ProductFilter>(
    name: 'update:filter',
    type: T,
    filter: Pick<ProductFilter, T>
) => void

export {}
