"use client";
import EmployeeInput from "@/components/employeeInput";
import EmployeeTable from "@/components/employeeTable";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { EMPLOYEE_IMPORT_SHEET_NAME } from "@/utils/constant";
import { ENDPOINTS } from "@/constant/api";
import { users } from "@prisma/client";

const exportToExcel = async () => {
  const response = await fetch(ENDPOINTS.users);
  const users = await response.json();

  const data = users.map((user: users, idx: number) => ({
    ID: idx + 1,
    Name: user.name,
    Email: user.email,
    "Employee Code": user.employee_code,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, EMPLOYEE_IMPORT_SHEET_NAME);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const excelFile = new File([excelBlob], "Employee Information.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(excelFile);
};

export default function Employees() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-full">
      <div className="px-6 py-8 mx-auto md:h-full lg:py-0">
        <div className="py-2">Import employees</div>
        <div className="flex justify-between mt-3">
          <EmployeeInput />
          <Button
            onClick={exportToExcel}
            className="bg-cyan-700 hover:bg-cyan-600"
          >
            Export file
          </Button>
        </div>
        <div className="bg-white my-6 rounded-md">
          <EmployeeTable />
        </div>
      </div>
    </section>
  );
}
