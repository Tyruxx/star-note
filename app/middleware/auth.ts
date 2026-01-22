import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  try {
    const { account } = useAppwrite()
    await account.get()
  }
  catch (err) {
    return navigateTo('/login')
  }
})