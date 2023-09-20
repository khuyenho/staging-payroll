import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { createPayroll, getPayrolls } from "@/lib/payrolls";
import { createPayrollDetail, getPayrollDetails } from "@/lib/payrollDetails";

export const GET = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  try {
    const payrollId = req.url.slice(req.url.lastIndexOf("/") + 1);

    const payrolls = await getPayrollDetails(Number(payrollId));

    return NextResponse.json(payrolls);
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
  // }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  // if (session) {
  const body = await req.json();

  try {
    const newPayroll = await createPayrollDetail(body);
    return NextResponse.json(newPayroll);
  } catch (err) {
    return NextResponse.json({ message: "POST error", err }, { status: 500 });
  }
  // }
  // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};
