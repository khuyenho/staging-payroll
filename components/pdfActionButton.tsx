"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/confirmModal";
import { toast } from "react-toastify";
import { ENDPOINTS } from "@/app/constant/api";
import { mutate } from "swr";
import { PayrollDetail } from "@/types/payroll";
import { updatePayrollStatus } from "@/firebase/payrolls";

type PDFActionButtonType = {
  payrollDetails: PayrollDetail[];
  month: number;
  year: number;
};
const handleGeneratePDF = async ({
  payrollDetails,
  month,
  year,
}: PDFActionButtonType) => {
  try {
    const res = await toast.promise(
      fetch(ENDPOINTS.filesGenerate, {
        method: "POST",
        body: JSON.stringify({
          month,
          year,
          payrollDetails,
        }),
      }),
      {
        pending: "Generating PDFs...",
        success: "Payment PDFs have been generated successfully.",
        error:
          "Failed to generate Monthly Payment PDFs. Please contact system admin for support.",
      }
    );
    if (res.ok) {
      mutate(`${ENDPOINTS.payrolls}?month=${month}&year=${year}`);
    }
  } catch (error) {
    console.error("Error generate pdf:", error);
  }
};

const handleSendAllEmail = async ({
  month,
  year,
  payrollDetails,
}: PDFActionButtonType) => {
  try {
    const res = await toast.promise(
      fetch(ENDPOINTS.emailSendAll, {
        method: "POST",
        body: JSON.stringify({
          month,
          year,
          payrollDetails,
        }),
      }),
      {
        pending: "Sending emails...",
        success: "Sent email successfully!",
        error: "Failed to send email!",
      }
    );
    if (res.ok) {
      mutate(`${ENDPOINTS.payrolls}?month=${month}&year=${year}`);
    }
  } catch (error) {
    console.error("Error send email:", error);
  }
};

function PDFActionButton({ payrollDetails, month, year }: PDFActionButtonType) {
  return (
    <div className="flex justify-between w-3/4 m-auto">
      <ConfirmModal
        variant="confirm"
        title="Confirmation"
        contentText="Are you sure to generate the PDF payment details of all employees for this payroll?"
        openBtn={
          <Button
            variant={"outline"}
            className="bg-cyan-700 hover:bg-cyan-600 text-white hover:text-white"
          >
            Generate Monthly Payment PDF
          </Button>
        }
        handleConfirm={() => handleGeneratePDF({ payrollDetails, month, year })}
      />

      <ConfirmModal
        title="Confirmation"
        variant="confirm"
        contentText="Are you sure to send the generated payment PDF of the selected employee?"
        openBtn={
          <Button className="bg-cyan-700 hover:bg-cyan-600">
            Send All Payment PDFs
          </Button>
        }
        handleConfirm={() =>
          handleSendAllEmail({ payrollDetails, month, year })
        }
      />
    </div>
  );
}

export default PDFActionButton;
