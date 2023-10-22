import { NextResponse } from "next/server";
import { getPayrollDetails, updateEmailStatus } from "@/lib/payrollDetails";

export const GET = async (req: Request, res: Response) => {
  try {
    const payrollId = req.url.slice(req.url.lastIndexOf("/") + 1);
    const payrollDetails = await getPayrollDetails(Number(payrollId));

    return NextResponse.json(payrollDetails);
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
};

export const PUT = async (req: Request, res: Response) => {
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
};
