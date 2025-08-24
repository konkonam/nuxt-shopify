<script setup lang="ts">
const { data: customer, error } = await useFetch('/api/customer/account')

console.log(error.value)
</script>

<template>
    <div>{{ customer }}</div>
</template>
