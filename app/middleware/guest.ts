import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  const { account } = useAppwrite()
  try {
    await account.getSession({
      sessionId: 'current'
    })
    return navigateTo('/')
  }
  catch (error) {
  }
})