"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Login from "./(auth)/login/page";
import { ROUTES } from "../constant/routes";

export default function Home() {
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return (
  //     <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  //       <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center flex justify-content">
  //         <Loader2 className="animate-spin" /> Loading...
  //       </div>
  //     </div>
  //   );
  // } else if (!session) {
  //   return <Login />;
  // }
  redirect(ROUTES.payrolls);
}
