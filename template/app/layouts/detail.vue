<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
    <UContainer class="flex flex-col gap-1 pt-4 pb-18">
        <UBreadcrumb
            :items="[
                {
                    label: 'Home',
                },
                {
                    label: t('product.label'),
                },
            ]"
            class="mt-2 md:mt-4"
        />

        <main class="flex flex-col gap-4">
            <slot />
        </main>
    </UContainer>
</template>
