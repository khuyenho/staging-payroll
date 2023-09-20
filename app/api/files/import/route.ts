import { createPayroll } from "@/firebase/payrolls";
import { NextResponse } from "next/server";

export const POST = async (request: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  try {
    const req = await request.json(); // res now contains body
    const { month, year, total, payrollDetails } = req;
    await createPayroll({ month, year, total, payrollDetails });
    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return e;
  }
  return NextResponse.json(res);
  // }
  // return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};
