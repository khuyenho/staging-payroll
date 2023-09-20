"use client";
import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import {
  capitalizeFirstLetter,
  fetcher,
  formatDateTime,
  numberWithCommas,
} from "@/utils/helper";
import ConfirmModal from "./confirmModal";
import { ENDPOINTS } from "@/app/constant/api";
import PasswordInput from "./passwordInput";

const EmployeeTable = () => {
  const { data: users, error, isLoading } = useSWR(ENDPOINTS.users, fetcher);
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  if (users && users.length)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Employee Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any, idx: number) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <PasswordInput password={user.employee_code} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <div>
      <p className="p-3">No data</p>
    </div>
  );
};
export default EmployeeTable;
