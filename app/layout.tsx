import "@/app/globals.css";

import React from "react";
import SessionProviderWrapper from "@/utils/sessionProviderWrapper";
import "react-toastify/dist/ReactToastify.min.css";
import DatabaseStatus from "@/components/databaseStatus";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <body>
          <DatabaseStatus />
          {children}
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
