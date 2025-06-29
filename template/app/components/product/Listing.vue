<script setup lang="ts">
const props = defineProps<{
    handle: string
}>()

const { filters: activeFilters, count: activeFilterCount } = useFilters()
const { t, locale } = useI18n()
const { country } = useCountry()
const router = useRouter()
const route = useRoute()

const before = ref<string>()
const after = ref<string>()

const first = computed(() => before.value ? undefined : 12)
const last = computed(() => before.value ? 12 : undefined)

const key = computed(() => [
    'listing',
    props.handle,
    locale.value,
    country.value,
    before.value,
    after.value,
    route.query.filters,
].join('-'))

const { data, status } = await useFetch('/api/collection/products', {
    key,
    method: 'POST',
    body: {
        handle: props.handle,
        filters: activeFilters,
        language: locale,
        country,
        first,
        last,
        before,
        after,
    },
})

const products = computed(() => data.value?.collection?.products)
const filters = computed(() => products.value?.filters ?? [])

const toTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

const loadPrevious = () => {
    after.value = undefined
    before.value = products.value?.pageInfo.startCursor ?? undefined

    toTop()
}

const loadNext = () => {
    before.value = undefined
    after.value = products.value?.pageInfo.endCursor ?? undefined

    toTop()
}

const onFilterUpdate = () => {
    before.value = undefined
    after.value = undefined

    toTop()
}

const resetFilters = async () => {
    console.log('Resetting filters')

    router.replace({ query: {
        ...route.query,
        filters: undefined,
    } })

    before.value = undefined
    after.value = undefined

    toTop()
}

watch([locale, country], () => {
    before.value = undefined
    after.value = undefined

    toTop()
})
</script>

<template>
    <div class="py-4 flex gap-1 lg:gap-8 lg:justify-end">
        <UDrawer
            :title="t('filters.label')"
            description="Quickly find the perfect vintage piece that suits you"
            :ui="{ container: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8' }"
            handle-only
        >
            <UButton
                variant="outline"
                size="xs"
                icon="hugeicons:filter-horizontal"
                :label="`${t('filters.label')} ${activeFilterCount > 0 ? `(${activeFilterCount})` : ''}`"
                class="lg:hidden"
            />

            <template #body>
                <ProductFilters
                    class="pt-4 pb-10 w-full"
                    :filters="filters"
                    @update="onFilterUpdate"
                />
            </template>
        </UDrawer>

        <UButton
            v-if="activeFilterCount > 0"
            variant="link"
            color="neutral"
            size="xs"
            icon="hugeicons:cancel-01"
            :label="t('filters.clear')"
            class="lg:hidden"
            @click="resetFilters"
        />

        <Sortings />
    </div>

    <USeparator class="mb-8" />

    <div class="flex flex-row gap-16 grow">
        <aside class="hidden top-20 lg:block w-1/4 min-w-64 sticky mb-auto">
            <div class="flex items-center justify-between pb-2">
                <h2 class="text-xl font-bold">
                    Filters
                </h2>

                <UButton
                    v-if="activeFilterCount > 0"
                    variant="link"
                    color="neutral"
                    size="xs"
                    icon="hugeicons:cancel-01"
                    :label="t('filters.clear')"
                    class="pt-1.5 cursor-pointer"
                    @click="resetFilters"
                />
            </div>

            <p class="pb-6">
                Quickly find the perfect vintage piece that suits you
            </p>

            <ProductFilters
                :filters="filters"
                @update="onFilterUpdate"
            />
        </aside>

        <div>
            <div
                v-if="products?.pageInfo.hasPreviousPage"
                class="flex w-full justify-center pb-8 md:mb-8"
            >
                <UButton
                    variant="soft"
                    color="primary"
                    class="cursor-pointer"
                    icon="hugeicons:arrow-up-01"
                    @click="loadPrevious"
                >
                    {{ t('listing.loadPrevious') }}
                </UButton>
            </div>

            <div class="grid w-full grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3 pb-8">
                <div
                    v-for="(product, index) in products?.edges"
                    :key="product.node.id"
                    class="relative"
                >
                    <ProductCard
                        :product="product.node"
                        class="h-full"
                    />

                    <USeparator
                        orientation="vertical"
                        :ui="{
                            root: [
                                'absolute',
                                '-right-8',
                                'top-0',
                                'h-full',
                                'transition-colors',
                                'duration-200',
                                'hidden',
                                ...[index % 2 > 0 ? 'md:hidden' : 'md:block'],
                                ...[index % 3 > 1 ? 'xl:hidden' : 'xl:block'],
                            ],
                        }"
                    />

                    <USeparator
                        orientation="horizontal"
                        :ui="{
                            root: [
                                'absolute',
                                '-bottom-8',
                                'left-0',
                                'w-full',
                                'transition-colors',
                                'duration-200',
                            ],
                        }"
                    />
                </div>
            </div>

            <div
                v-if="products?.pageInfo.hasNextPage"
                class="flex w-full justify-center mt-16"
            >
                <UButton
                    variant="soft"
                    color="primary"
                    class="cursor-pointer"
                    icon="hugeicons:arrow-down-01"
                    @click="loadNext"
                >
                    {{ t('listing.loadNext') }}
                </UButton>
            </div>

            <div
                v-if="status === 'pending'"
                class="flex justify-center pt-8"
            >
                Loading...
            </div>

            <div
                v-else-if="!products || products.edges.length === 0"
                class="flex flex-col justify-center items-center col-span-full text-center"
            >
                <div class="flex items-center pb-2 gap-2">
                    <UIcon
                        name="hugeicons:alert-01"
                        class="text-dimmed size-6"
                    />

                    <p class="text-xl text-dimmed">
                        No products found
                    </p>
                </div>

                <UButton
                    v-if="activeFilterCount > 0"
                    variant="ghost"
                    @click="resetFilters"
                >
                    Reset filters
                </UButton>
            </div>
        </div>
    </div>
</template>
