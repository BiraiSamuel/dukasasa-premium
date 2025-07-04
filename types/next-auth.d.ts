// /types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}
