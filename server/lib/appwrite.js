import { Client, Account } from "node-appwrite";

export const SESSION_COOKIE = "my-custom-session";

export function createAdminClient() {
  const config = useRuntimeConfig();
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProject)
    .setKey(config.public.appwriteKey);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export function createSessionClient(event) {
  const config = useRuntimeConfig(event);

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId);

  const session = getCookie(event, SESSION_COOKIE);
  if (session) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },
  };
}