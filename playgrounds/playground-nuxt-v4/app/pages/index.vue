<script setup lang="ts">
import { useFetch } from '#imports'

const products = await useFetch('/api/products', {
    query: {
        first: 10,
    },
})
</script>

<template>
    <pre>{{ products }}</pre>
</template>
