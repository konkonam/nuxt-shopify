<template>
    <UContainer class="flex flex-col gap-1 pt-4 pb-18">
        <Breadcrumbs class="mt-2 md:mt-4" />

        <main class="flex flex-col gap-4">
            <slot />
        </main>
    </UContainer>
</template>
