import { createPayroll } from "@/firebase/payrolls";
import { NextResponse } from "next/server";

export const POST = async (request: Request, res: Response) => {
  try {
    const req = await request.json();
    const { month, year, total, payrollDetails } = req;
    await createPayroll({ month, year, total, payrollDetails });
    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return e;
  }
};
