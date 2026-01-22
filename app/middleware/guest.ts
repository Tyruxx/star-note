import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  const { account } = useAppwrite()
  try {
    const session = await account.get()
    console.log(session);
    return navigateTo('/')
  }
  catch (error) {
    console.log(error)
  }
})