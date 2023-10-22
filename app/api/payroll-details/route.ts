import { NextResponse } from "next/server";
import { createPayrollDetail, getPayrollDetails } from "@/lib/payrollDetails";

export const GET = async (req: Request, res: Response) => {
  try {
    const payrollId = req.url.slice(req.url.lastIndexOf("/") + 1);

    const payrolls = await getPayrollDetails(Number(payrollId));

    return NextResponse.json(payrolls, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const newPayroll = await createPayrollDetail(body);
    return NextResponse.json(newPayroll);
  } catch (err) {
    return NextResponse.json({ message: "POST error", err }, { status: 500 });
  }
};
