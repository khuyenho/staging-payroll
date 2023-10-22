"use client";

import "react-toastify/dist/ReactToastify.min.css";
import { Ban } from "lucide-react";

function DeniedPage() {
  return (
    <div className="text-center">
      <h1 className="font-bold text-2xl mb-3">
        <code>Access Denied</code>
      </h1>
      <h3 className="w3-center w3-animate-right">
        You don&apos;t have permission to view this site.
      </h3>
      <h3 className="flex justify-center gap-2 m-5 text-red-600">
        <Ban />
        <Ban />
        <Ban />
      </h3>
    </div>
  );
}

export default DeniedPage;
