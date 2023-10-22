"use client";
import "@/app/globals.css";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Header from "@/components/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ENDPOINTS } from "@/constant/api";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionContent>{children}</SessionContent>;
}

async function keycloakSessionLogOut() {
  try {
    await fetch(ENDPOINTS.authLogout, {
      method: "GET",
    });
  } catch (err) {
    console.error(err);
  }
}

export const SessionContent = ({ children }: { children: React.ReactNode }) => {
  // const { data: session, status } = useSession();

  // useEffect(() => {
  //   const expiresTimeTimestamp = Math.floor(
  //     new Date(session?.expires || "").getTime()
  //   );
  //   const currentTimestamp = Date.now();
  //   const timeRemaining = expiresTimeTimestamp - currentTimestamp;

  //   if (timeRemaining < 0) {
  //     // session has expired, logout the user and display session expiration message
  //     keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
  //   }
  // }, [session, status]);

  // if (status == "loading") {
  //   return (
  //     <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  //       <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center flex justify-content">
  //         <Loader2 className="animate-spin" /> Loading...
  //       </div>
  //     </div>
  //   );
  // } else if (!session) {
  //   return <>{children}</>;
  // } else if (session)
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between shadow-sm">
        <Header
          username={"Username"}
          onClick={() => {
            keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
          }}
        />
      </div>
      <div className="relative flex flex-grow">
        {/* <nav className="bg-white shadow-sm space-y-6 w-64">
          <Navbar />
        </nav> */}
        <main className="bg-gray-100 flex-1 p-6">{children}</main>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};
