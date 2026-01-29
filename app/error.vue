<script setup lang="ts">
import type { NuxtError } from '#app'
import { Button } from '@/components/ui/button'

const props = defineProps<{ error: NuxtError }>()
</script>

<template>
  <div class="mx-auto px-8 py-8 flex flex-col gap-4 max-w-lg">
    <div class="text-4xl font-semibold">
      An error has occurred
    </div>
    <div class=" text-base font-medium">
      Error Code {{ props.error.statusCode }} - {{ props.error.message }}
    </div>
    <a href="/"><Button>Go back home</Button></a>
  </div>
</template>
