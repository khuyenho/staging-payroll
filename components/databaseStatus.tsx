"use client";

import { ENDPOINTS } from "@/constant/api";
import { fetcher } from "@/utils/helper";
import { useEffect } from "react";
import useSWR from "swr";

const DatabaseStatus = () => {
  const { data, error } = useSWR(ENDPOINTS.database, fetcher);

  console.log(error);

  useEffect(() => {
    if (error) {
      console.error("Failed to connect to the database:", error);
    }
  }, [error]);

  if (!data) {
    return null;
  }

  if (data.status !== "connected") {
    console.log("Failed to connect to the database");
  }

  return null;
};
export default DatabaseStatus;
