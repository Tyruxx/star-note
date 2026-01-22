import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  try {
    const { account } = useAppwrite()
    account.get().then().catch(() => {
      navigateTo('/login')
    })
  }
  catch (err) {
    return navigateTo('/login')
  }
})