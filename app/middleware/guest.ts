import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  try {
    const { account } = useAppwrite()
    await account.get()
    return navigateTo('/')
  }
  catch (err) {
  }
})