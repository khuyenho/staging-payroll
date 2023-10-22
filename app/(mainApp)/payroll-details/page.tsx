"use client";

import React from "react";
import PayrollDetailsTable from "@/components/payrollDetailsTable";
import {
  capitalizeFirstLetter,
  fetcher,
  numberWithCommas,
} from "@/utils/helper";
import PDFActionButton from "@/components/pdfActionButton";
import useSWR from "swr";
import { ENDPOINTS } from "@/constant/api";
import { useSearchParams } from "next/navigation";

type Params = {
  params: {
    id: string;
  };
};

const PayrollDetail = ({ params: { id } }: Params) => {
  const searchParams = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const {
    data: payrollInfo,
    error,
    isLoading,
  } = useSWR(ENDPOINTS.payrolls + `?month=${month}&year=${year}`, fetcher);
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  const { total, status, payrollDetails } = payrollInfo[0];

  return (
    <div>
      <PDFActionButton
        payrollDetails={payrollDetails}
        month={parseInt(month || "0")}
        year={parseInt(year || "0")}
      />
      <div>
        <h3 className="font-bold text-lg">Payroll Detail</h3>
        <p>
          <span className="font-bold">Month:</span> {month}/{year}
        </p>
        <p>
          <span className="font-bold">Status:</span>{" "}
          {capitalizeFirstLetter(status)}
        </p>
        <p>
          <span className="font-bold">Total:</span> {numberWithCommas(total)}{" "}
          VND
        </p>
      </div>
      <div className="bg-white my-6 rounded-md">
        <PayrollDetailsTable
          data={payrollDetails}
          month={parseInt(month || "0")}
          year={parseInt(year || "0")}
        />
      </div>
    </div>
  );
};

export default PayrollDetail;
