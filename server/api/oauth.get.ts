import { SESSION_COOKIE, createUserClient } from "../lib/appwrite";

export default defineEventHandler(async (event) => {
  // Extract the userId and secret from the URL query parameters
  const { userId, secret } = getQuery<{userId: string, secret: string}>(event);
  if (!userId || !secret) {
    return sendRedirect(event, "/login");
  }

  // Create the Appwrite client
  const { account } = createUserClient();

  // Exchange the token userId and secret for a session
  const session = await account.createSession({
    userId,
    secret
  });

  // Set the session cookie
  setCookie(event, SESSION_COOKIE, session.secret, {
    expires: new Date(session.expire),
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  // Redirect the user to the account page
  await sendRedirect(event, "/");
});