// my-project/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    access_token?: string;
    id_token?: string;
    roles?: any;
    error?: any;
    user: User;
  }

  interface User extends DefaultUser {
    roles: strings[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    roles: string[];
  }
}
