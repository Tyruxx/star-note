import { Client, Account } from 'appwrite'
export const useMiddleware = () => {

  async function authMiddleware() {
    try {
        const client = new Client()
        .setEndpoint('https://sgp.cloud.appwrite.io/v1')
        .setProject('6971c35a00282090bd21')
        const account = new Account(client)
        const session = await account.get()
    }
    catch (error) {
        return navigateTo('/login')
    }
  }

  async function guestMiddleware() {
    try {
        const client = new Client()
        .setEndpoint('https://sgp.cloud.appwrite.io/v1')
        .setProject('6971c35a00282090bd21')
        const account = new Account(client)
        const session = await account.get()
        return navigateTo('/')
    }
    catch (error) {
    }
  }

  return { authMiddleware, guestMiddleware }
}