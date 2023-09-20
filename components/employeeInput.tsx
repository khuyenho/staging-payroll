"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { Prisma } from "@prisma/client";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EMPLOYEE_IMPORT_SHEET_NAME, SHEET_NAME } from "@/utils/constant";
import importSheetToJson from "@/utils/excelImport";
import { fetcher, validateEmployeeImportFile } from "@/utils/helper";
import ConfirmModal from "./confirmModal";
import { ENDPOINTS } from "@/app/constant/api";

const EmployeeInput = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: users, error, isLoading } = useSWR(ENDPOINTS.users, fetcher);
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const filename = selectedFile.name.split(".");
      const [month, year] = filename[0].split("_");

      const userData = await importSheetToJson(
        selectedFile,
        EMPLOYEE_IMPORT_SHEET_NAME,
        0
      );

      if (!validateEmployeeImportFile(userData[0])) {
        toast.error("Invalid file format. Please upload a valid file.");
      } else {
        userData.shift(); //remvove header
        // convert to object list
        const userList = userData.map((user) => ({
          name: user[1],
          email: user[2],
          employeeCode: user[3].toString(),
        }));
        try {
          const res = await toast.promise(
            fetch(ENDPOINTS.filesEmployeeImport, {
              method: "POST",
              body: JSON.stringify({
                employeeImportList: userList,
              }),
            }),
            {
              pending: "Importing employee...",
              success: "Employee information successfully imported.",
              error:
                "Failed to import employee information. Please contact system admin for support",
            }
          );
          if (res.ok) {
            // Manually trigger a revalidation of the data
            mutate(ENDPOINTS.users);
          }
        } catch (e) {
          console.log(e);
          return e;
        }
      }
    }
  };

  return (
    <div>
      <div className="flex w-full max-w-xl items-center space-x-2">
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
    </div>
  );
};

export default EmployeeInput;
