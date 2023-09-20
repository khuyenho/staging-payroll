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

const PayrollTable = () => {
  const {
    data: payrolls,
    error,
    isLoading,
  } = useSWR(ENDPOINTS.payrolls, fetcher);
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  const handleDelete = async (month: number, year: number) => {
    try {
      const res = await toast.promise(
        fetch(`${ENDPOINTS.payrolls}?month=${month}&year=${year}`, {
          method: "DELETE",
        }),
        {
          pending: "Deleting payroll...",
          success: "The payroll has been deleted successfully.",
          error: "Error when deleting payroll!",
        }
      );

      if (res.ok) {
        // Manually trigger a revalidation of the data
        mutate(ENDPOINTS.payrolls);
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (payrolls && payrolls.length)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls.map((payroll: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>{formatDateTime(payroll.created_at)}</TableCell>
              <TableCell>
                {payroll.month}/{payroll.year}
              </TableCell>
              <TableCell>{numberWithCommas(payroll.total)}</TableCell>
              <TableCell>{capitalizeFirstLetter(payroll.status)}</TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/payroll-details?month=${payroll.month}&year=${payroll.year}`}
                >
                  <Button variant={"outline"} className="mr-1">
                    View
                  </Button>
                </Link>
                <ConfirmModal
                  variant="delete"
                  title={"Confirmation"}
                  contentText={
                    "Are you sure to delete this payroll permanently?"
                  }
                  openBtn={
                    <Button className="ml-1" variant="destructive">
                      Delete
                    </Button>
                  }
                  handleConfirm={() =>
                    handleDelete(payroll.month, payroll.year)
                  }
                />
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
export default PayrollTable;
