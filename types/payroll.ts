import Decimal from "decimal.js";

export type StrictPayroll = {
  month: number;
  year: number;
  total: Decimal;
  payrollDetails: PayrollDetail[];
};

export type PayrollDetail = {
  allowance: number;
  fullName: string;
  leaveBalance: number;
  lunch: number;
  nightShiftHours: number;
  nightShiftSalary: number;
  offeredSalary: number;
  other: number;
  otherAllowance: number;
  overtime: number;
  overtime2xHours: number;
  overtime2xSalary: number;
  overtime3xHours: number;
  overtime3xSalary: number;
  parking: number;
  petrol: number;
  receiveCLVN: number;
  receiveWise: number;
  total: number;
  fileUrl?: string;
  emailStatus?: "pending" | "success" | "fail";
};

export type Payroll = {
  month?: number;
  year?: number;
};
