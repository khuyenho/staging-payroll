import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { decrypt } from "./encryption";

export async function getAccessToken() {
  const session = await getServerSession(authOptions);
  if (session) {
    const accessTokenDecrypted = decrypt(session.access_token as string);
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session = await getServerSession(authOptions);
  if (session) {
    const idTokenDecrypted = decrypt(session.id_token as string);
    return idTokenDecrypted;
  }
  return null;
}
