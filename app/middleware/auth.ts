import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  // const { account } = useAppwrite()
  // account.get()
  // .then()
  // .catch(() => {
  //   navigateTo('/login')
  // })
  const { account } = useAppwrite()
  try {
    await account.get()
  }
  catch (error) {
    return navigateTo('/error')
  }
})