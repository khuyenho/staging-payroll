import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { getPayrolls } from "@/lib/payrolls";
import { getPayrollDetails, updateEmailStatus } from "@/lib/payrollDetails";

export const GET = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  try {
    const payrollId = req.url.slice(req.url.lastIndexOf("/") + 1);
    const payrollDetails = await getPayrollDetails(Number(payrollId));

    return NextResponse.json(payrollDetails);
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
  // }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};

export const PUT = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  try {
    const payrollId = req.url.slice(req.url.lastIndexOf("/") + 1);
    const body = await req.json(); // res now contains body
    const { successUsers, failUsers } = body;
    try {
      const res = await updateEmailStatus({
        successUsers,
        failUsers,
      });
    } catch (err) {
      console.log(err);
    }
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
  // }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};

// export const POST = async (req: Request) => {
//   const session = await getServerSession(authOptions);
//   // if (session) {
//   const prisma = new PrismaClient();
//   const body = await req.json();
//   const { month, year, total, status } = body;

//   try {
//     const newPayroll = await prisma.payrolls.create({
//       data: {
//         month,
//         year,
//         total,
//         status,
//       },
//     });
//     return NextResponse.json(newPayroll);
//   } catch (err) {
//     return NextResponse.json({ message: "POST error", err }, { status: 500 });
//   }
//   // }
//   // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// };
