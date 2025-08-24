<script setup lang="ts">
const { data: customer } = await useFetch('/api/customer/account')
</script>

<template>
    <div>{{ customer }}</div>
</template>
