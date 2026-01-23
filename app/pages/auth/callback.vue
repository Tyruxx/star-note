<script setup lang="ts">
import { useAppwrite } from '~/composables/useAppwrite'

const route = useRoute()
const { account } = useAppwrite()

onMounted(async () => {
  const userId = route.query.userId as string | undefined
  const secret = route.query.secret as string | undefined

  if (!userId || !secret) {
    return navigateTo('/login')
  }

  try {
    await account.createSession({
      userId,
      secret
    })

    // Optional: fetch user now that session exists
    await account.get()

    // Redirect wherever you want
    return navigateTo('/')
  } catch (e) {
    console.log((e as any)?.message ?? e)
    return navigateTo('/login')
  }
})
</script>

<template>
  <div>Signing you in...</div>
</template>