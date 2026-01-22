import { useAppwrite } from "~/composables/useAppwrite"

export default defineNuxtRouteMiddleware(async () => {
  const { account } = useAppwrite()
  await account.get()
  .then(() => {
    navigateTo('/')
  })
  .catch((error) => {

  })
})