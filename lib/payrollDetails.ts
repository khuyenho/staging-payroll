import { flattenObject } from "@/utils/helper";
import prisma from "./prisma";
import Decimal from "decimal.js";

type PayrollDetail = {
  userId: number;
  payrollId: number;
  overtime?: Decimal;
  others?: Decimal;
  leaveBalance?: Decimal;
  allowance?: Decimal;
  monthlySalary?: Decimal;
  totalSalary?: Decimal;
  vnbankSalary?: Decimal;
  wiseSalary?: Decimal;
  overtime2xHours?: Decimal;
  overtime3xHours?: Decimal;
  overtime2xSalary?: Decimal;
  overtime3xSalary?: Decimal;
  nightShiftHours?: Decimal;
  nightShiftSalary?: Decimal;
  lunch?: Decimal;
  petrol?: Decimal;
  parking?: Decimal;
  otherAllowance?: Decimal;
};
export async function getPayrollDetails(id: number) {
  try {
    const payrollDetails = await prisma.payroll_details.findMany({
      include: {
        users: {
          select: {
            name: true,
            email: true,
            employee_code: true,
          },
        },
      },
      where: {
        payroll_id: id,
      },
    });

    const flattenedObjArr = payrollDetails.map((payrollDetail) =>
      flattenObject(payrollDetail)
    );

    return flattenedObjArr;
  } catch (e) {
    return { e };
  }
}

export async function createPayrollDetail(body: PayrollDetail) {
  const data = {
    user_id: body.userId,
    payroll_id: body.payrollId,
    overtime: body.overtime ?? undefined,
    others: body.others ?? undefined,
    leave_balance: body.leaveBalance ?? undefined,
    allowance: body.allowance ?? undefined,
    monthly_salary: body.monthlySalary ?? undefined,
    total_salary: body.totalSalary ?? undefined,
    vnbank_salary: body.vnbankSalary ?? undefined,
    wise_salary: body.wiseSalary ?? undefined,
    overtime2x_hours: body.overtime2xHours ?? undefined,
    overtime3x_hours: body.overtime3xHours ?? undefined,
    overtime2x_salary: body.overtime2xSalary ?? undefined,
    overtime3x_salary: body.overtime3xSalary ?? undefined,
    night_shift_hours: body.nightShiftHours ?? undefined,
    night_shift_salary: body.nightShiftSalary ?? undefined,
    lunch: body.lunch ?? undefined,
    petrol: body.petrol ?? undefined,
    parking: body.parking ?? undefined,
    other_allowance: body.otherAllowance ?? undefined,
  };
  try {
    const payrollDetail = await prisma.payroll_details.create({ data: data });

    return payrollDetail;
  } catch (e) {
    return { e };
  }
}

export const updateFileUser = async (
  name: string,
  month: number,
  year: number,
  fileUrl: string
) => {
  try {
    // const paymentDetail = await prisma.payroll_details.updateMany({
    //   data: {
    //     file_url: fileUrl,
    //   },
    //   where: {
    //     users: {
    //       name,
    //     },
    //     payrolls: {
    //       month,
    //       year,
    //     },
    //   },
    // });

    // return paymentDetail;
    
  } catch (e) {
    return { e };
  }
};

export const updateEmailStatus = async ({
  successUsers,
  failUsers,
  pendingUsers,
}: {
  successUsers?: string[];
  failUsers?: string[];
  pendingUsers?: string[];
}) => {
  try {
    const paymentDetail = await prisma.$transaction(async (tx) => {
      await tx.payroll_details.updateMany({
        data: {
          email_status: "success",
        },
        where: {
          users: {
            name: {
              in: successUsers,
            },
          },
        },
      });

      await tx.payroll_details.updateMany({
        data: {
          email_status: "fail",
        },
        where: {
          users: {
            name: {
              in: failUsers,
            },
          },
        },
      });
    });

    return paymentDetail;
  } catch (e) {
    return { e };
  }
};
