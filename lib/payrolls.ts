import Decimal from "decimal.js";
import prisma from "./prisma";
import { PaymentStatus } from "@/utils/type";
import { PAYROLL_STATUS_NEW } from "@/utils/constant";

type Payroll = {
  month: number;
  year: number;
  total: Decimal;
  status?: PaymentStatus;
};

type PayrollQuery = {
  month?: string | null;
  year?: string | null;
};

export const getPayrolls = async ({ month, year }: PayrollQuery) => {
  try {
    const payrolls = await prisma.payrolls.findMany({
      where: {
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined,
      },
    });
    return payrolls;
  } catch (e) {
    return { e };
  }
};

export const getPayrollById = async (id: number) => {
  try {
    const payroll = await prisma.payrolls.findUnique({
      where: {
        id: id,
      },
    });
    return payroll;
  } catch (e) {
    return e;
  }
};

export const getPayrollByConditions = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  try {
    const payroll = await prisma.payrolls.findMany({
      where: {
        month,
        year,
      },
    });
    return payroll;
  } catch (e) {
    return e;
  }
};

export const deletePayrollById = async (id: number) => {
  try {
    const payroll = await prisma.payrolls.delete({
      where: {
        id,
      },
    });
    return payroll;
  } catch (e) {
    return e;
  }
};

export const createPayroll = async (payroll: Payroll) => {
  const data = {
    month: payroll.month,
    year: payroll.year,
    total: payroll.total,
    status: payroll.status ? payroll.status : PAYROLL_STATUS_NEW,
  };

  try {
    const payroll = await prisma.payrolls.create({
      data: data,
    });

    return payroll;
  } catch (e) {
    return e;
  }
};

export const updatePayrollStatus = async (payrollId: number) => {
  try {
    const payroll = await prisma.payrolls.update({
      where: {
        id: payrollId,
      },
      data: {
        status: "paid",
        updated_at: new Date(),
      },
    });
    return payroll;
  } catch (e) {
    return e;
  }
};
