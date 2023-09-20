"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.min.css";
import { redirect } from "next/navigation";

function Login() {
  const { data: session, status } = useSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome to Admin Site
            </h1>
            <Button className="w-full" onClick={() => signIn("keycloak")}>
              LOG IN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
