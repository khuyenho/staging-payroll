import { Prisma } from "@prisma/client";
import prisma from "./prisma";

export const importFile = async (payload: any) => {
  try {
    const { month, year, totalMoney, payrollDetailArr } = payload;

    const res = await prisma.payrolls.create({
      data: {
        month: parseInt(month),
        year: parseInt(year),
        total: new Prisma.Decimal(totalMoney),
        payroll_details: {
          create: payrollDetailArr,
        },
      },
    });

    return res;
  } catch (e) {
    return { e };
  }
};
