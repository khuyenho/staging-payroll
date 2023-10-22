import { NextResponse } from "next/server";
import { createPayroll, deletePayroll, getPayrolls } from "@/firebase/payrolls";
import { NextApiResponse } from "next";

export const GET = async (req: Request, res: NextApiResponse) => {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  try {
    const payrolls = await getPayrolls({
      month: parseInt(month || ""),
      year: parseInt(year || ""),
    });

    return NextResponse.json(payrolls, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    await createPayroll(body);
    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "POST error", err }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  try {
    await deletePayroll({
      month: parseInt(month || ""),
      year: parseInt(year || ""),
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "ERROR error", err }, { status: 500 });
  }
};
