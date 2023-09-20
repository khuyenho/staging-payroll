import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES } from "./app/constant/roles";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    if (!request.nextauth.token?.roles.includes(ROLES.financialAdmin)) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/payrolls/:path*", "/employees"],
};
