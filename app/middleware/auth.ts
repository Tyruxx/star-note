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
    const session = await account.get()
    console.log(session)
  }
  catch (error) {
    // return navigateTo('/error')
    console.log(error)
  }
})