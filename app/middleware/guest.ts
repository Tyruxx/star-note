import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  const { account } = useAppwrite()
  try {
    const session = await account.getSession({
      sessionId: 'current'
    })
    console.log(session.provider);
    return navigateTo('/')
  }
  catch (error) {
    console.log(error)
  }
})