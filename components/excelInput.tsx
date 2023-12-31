"use client";

import React, { ChangeEvent, useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import { users } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SHEET_NAME } from "@/utils/constant";
import importSheetToJson from "@/utils/excelImport";
import ConfirmModal from "./confirmModal";
import { ENDPOINTS } from "@/constant/api";
import { HEADERS } from "@/constant/header";
import {
  convertHeaderAttribute,
  getPaymentDataFromFile,
  validateFileFormat,
} from "@/utils/helper";

const ExcelInput = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      if (!validateFileFormat(selectedFile.name)) {
        toast.error('Filename must have format "MM_yyyy.xlsx"');
      } else {
        const filename = selectedFile.name.split(".");
        const [month, year] = filename[0].split("_");

        const existedPayroll = await fetch(
          `${ENDPOINTS.payrolls}?month=${month}&year=${year}`,
          { method: "GET" }
        );

        if (existedPayroll.ok) {
          const payrollData = await existedPayroll.json();

          if (payrollData.length !== 0) {
            // check existed month year
            toast.error(
              `Payroll of ${month}/${year} has existed. Please remove the payroll before importing a new one`
            );
          } else {
            console.log("Importing...");
            const response = await fetch(ENDPOINTS.users, { method: "GET" });

            const jsonData = await importSheetToJson(
              selectedFile,
              SHEET_NAME,
              1
            );

            const header = jsonData[0];
            const dataArray = jsonData.slice(1);
            const users = await response.json();
            const { totalMoney, payrollDetails } = getPaymentDataFromFile({
              header,
              dataArray,
              users,
            });

            try {
              const res = await toast.promise(
                fetch(ENDPOINTS.filesImport, {
                  method: "POST",
                  body: JSON.stringify({
                    month: parseInt(month),
                    year: parseInt(year),
                    total: totalMoney,
                    payrollDetails,
                  }),
                }),
                {
                  pending: "Importing payroll...",
                  success: "The file has been imported successfully.",
                  error:
                    "Failed to import the file due to wrong file template. Please check again.",
                }
              );

              if (res.ok) {
                // Manually trigger a revalidation of the data
                mutate(ENDPOINTS.payrolls);
              }
            } catch (e) {
              console.log(e);

              return e;
            }
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="flex w-full max-w-xl items-center space-x-2 mt-3">
        <Input
          type="file"
          id="file_input"
          placeholder="File"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />

        <ConfirmModal
          variant="confirm"
          title={"Confirm File Import"}
          contentText={"Are you sure you want to import the selected file?"}
          openBtn={
            <Button className="w-1/4 bg-cyan-700 hover:bg-cyan-600">
              Import file
            </Button>
          }
          handleConfirm={handleFileUpload}
        />
      </div>
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        File must have format mm_yyyy (.xls, .xlsx)
      </p>
    </div>
  );
};

export default ExcelInput;
