import { createAdminClient } from "./../lib/appwrite";
import { OAuthProvider } from "node-appwrite";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { account } = createAdminClient();
  const endpoint = config.public.appwriteEndpoint;

  const redirectUrl = await account.createOAuth2Token({
    provider: OAuthProvider.Google,
    success: `${endpoint}/api/oauth`,
    failure: `${endpoint}/login`
  });

  // Redirect the user to the OAuth provider authorization page
  await sendRedirect(event, redirectUrl);
});