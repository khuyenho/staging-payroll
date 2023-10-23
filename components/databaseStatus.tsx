"use client";
import { ENDPOINTS } from "@/constant/api";
import { fetcher } from "@/utils/helper";
import useSWR from "swr";

const DatabaseStatus = () => {
  const { data, error } = useSWR(ENDPOINTS.database, fetcher);

  if (!data) {
    return null;
  }

  if (error) {
    console.error("Failed to connect to the database:", error);
  }

  if (data.status !== "connected") {
    console.log("Failed to connect to the database");
  }

  return null;
};

export default DatabaseStatus;
