<script lang="ts" setup>
    const stateConvertFrom = useState("convert-from")
    console.log(stateConvertFrom.value)
    const stateConvertTo = useState("convert-to")
</script>
<template>
    <span></span>
    <NuxtLink to="/">Back</NuxtLink>
</template>