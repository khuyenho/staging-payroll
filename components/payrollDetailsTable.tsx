"use client";

import React from "react";
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
import useSWR from "swr";
import PasswordInput from "./passwordInput";
import ConfirmModal from "./confirmModal";
import { ENDPOINTS } from "@/constant/api";
import { toast } from "react-toastify";
import { PayrollDetail } from "@/types/payroll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type PayrollDetailsTableType = {
  data: PayrollDetail[];
  month: number;
  year: number;
};
const PayrollDetailsTable = ({
  data,
  month,
  year,
}: PayrollDetailsTableType) => {
  const handleSendEmail = async (
    email: string,
    employeeName: string,
    fileUrl: string
  ) => {
    try {
      await toast.promise(
        fetch(ENDPOINTS.email, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            fileUrl,
            employeeName,
            month,
            year,
          }),
        }),
        {
          pending: "Sending emails...",
          success: "Send email successfully!",
          error: "Error when sending email!",
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadFile = async (fileName: string, fileUrl: string) => {
    try {
      const res = await toast.promise(
        fetch(ENDPOINTS.filesDownload, {
          method: "POST",
          body: JSON.stringify({
            fileUrl,
          }),
        }),
        {
          pending: "Downloading file...",
          success: "Downloaded file successfully!",
          error: "Error when downloading file!",
        }
      );
      if (!res.ok) {
        throw new Error("Error retrieving download URL");
      }
      const { fileContent } = await res.json();
      // Decode the Base64-encoded file content
      const decodedContent = atob(fileContent);
      // Convert the decoded content to a Uint8Array
      const uint8Array = new Uint8Array(decodedContent.length);
      for (let i = 0; i < decodedContent.length; i++) {
        uint8Array[i] = decodedContent.charCodeAt(i);
      }

      // Create a Blob from the Uint8Array
      const blob = new Blob([uint8Array], { type: "application/pdf" });

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.pdf`;
      link.click();

      // URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overflow-x">
      <Table className="table-auto overflow-scroll w-full">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>OT (VND)</TableHead>
            <TableHead>Total OT hours (x2)</TableHead>
            <TableHead>Total OT hours (x3)</TableHead>
            <TableHead>Others (VND)</TableHead>
            <TableHead>Leave balance (VND)</TableHead>
            <TableHead>Allowance (VND)</TableHead>
            <TableHead>Offered Salary (VND)</TableHead>
            <TableHead>Total Night shift hours (x2)</TableHead>
            <TableHead>Total Salary (VND)</TableHead>
            <TableHead>VN Bank Salary (VND)</TableHead>
            <TableHead>Wise Salary (VND)</TableHead>
            <TableHead>Employee Code</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Email Status</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data?.length ? (
            data.map((payrollDetail: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{formatDateTime(payrollDetail.createdAt)}</TableCell>
                <TableCell>{payrollDetail.fullName}</TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.overtime) || 0}
                </TableCell>
                <TableCell>{payrollDetail.overtime2xHours || 0}</TableCell>
                <TableCell>{payrollDetail.overtime3xHours || 0}</TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.other) || 0}
                </TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.leaveBalance) || 0}
                </TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.allowance) || 0}
                </TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.offeredSalary) || 0}
                </TableCell>
                <TableCell>{payrollDetail.nightShiftHours || 0}</TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.total) || 0}
                </TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.receiveCLVN) || 0}
                </TableCell>
                <TableCell>
                  {numberWithCommas(payrollDetail.receiveWise) || 0}
                </TableCell>
                <TableCell>
                  <PasswordInput password={payrollDetail.employeeCode} />
                </TableCell>

                <TableCell>
                  {payrollDetail.fileUrl ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="hover:text-cyan-700 hover:underline border-0 hover:bg-transparent shadow-transparent text-left p-0 w-[50px]"
                            onClick={() =>
                              handleDownloadFile(
                                `Payment Details_${payrollDetail.fullName}_${month}/${year}`,
                                payrollDetail.fileUrl
                              )
                            }
                          >
                            <p className="truncate">
                              {payrollDetail.fileUrl
                                ? `Payment Details_${payrollDetail.fullName}_${month}/${year}.pdf`
                                : "Not Generated Yet"}
                            </p>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{`Payment Details_${payrollDetail.fullName}_${month}/${year}.pdf`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    "Not Generated Yet"
                  )}
                </TableCell>
                <TableCell>
                  {payrollDetail.emailStatus === "success"
                    ? "Sent"
                    : payrollDetail.emailStatus === "fail"
                    ? "Error"
                    : payrollDetail.emailStatus === "pending"
                    ? "Pending"
                    : null}
                </TableCell>
                <TableCell className="text-center">
                  <ConfirmModal
                    title="Confirmation"
                    variant="confirm"
                    contentText="Are you sure to send the generated payment PDF of the selected employee?"
                    openBtn={
                      <Button
                        variant={"outline"}
                        className="w-[160px] p-0 border-cyan-700 hover:bg-gray-200"
                        disabled={!payrollDetail.emailStatus}
                      >
                        Send Payment PDF
                      </Button>
                    }
                    handleConfirm={() =>
                      handleSendEmail(
                        payrollDetail.email,
                        payrollDetail.fullName,
                        payrollDetail.fileUrl
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="m-auto">No data</TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollDetailsTable;
