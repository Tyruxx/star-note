import { OAuth2Client } from "google-auth-library";
import { supabase } from "./../../app/utils/supabase"

const config = useRuntimeConfig()
const googleClientId = config.googleClientId
const client = new OAuth2Client(googleClientId)

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const token = body.token

    if (!token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No token or invalid token provided'
        })
    }

    const user = await verify(token).catch(console.error);

    const { data: databaseData, error: databaseError } = await supabase.from('USER').select().eq('Email_Address', user?.email)
    const { count: nextUserId, error: countError } = await supabase.from('USER').select('*', { count: 'exact', head: false })
    if (databaseError || countError) {
        throw createError({
            statusCode: 500,
            statusMessage: "Database Error"
        })
    }
    if (databaseData?.length) {
    } else {
        await supabase.from('USER').insert({ User_Id: nextUserId, Email_Address: user?.email})
    }
    await setUserSession(event, {
        user: user ?? undefined
    })
    return user
})

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return payload;
  // This ID is unique to each Google Account, making it suitable for use as a primary key
  // during account lookup. Email is not a good choice because it can be changed by the user.
  // const userid = payload['sub'];
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
}