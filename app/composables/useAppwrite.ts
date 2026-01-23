import { Client, Account } from 'appwrite'

export const useAppwrite = () => {
  const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('6971c35a00282090bd21')

  const account = new Account(client)
  return { client, account }
}