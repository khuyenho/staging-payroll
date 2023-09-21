"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return null;
  // } else if (!session) {
  //   redirect("/login");
  // }
  redirect("/payrolls");
}
