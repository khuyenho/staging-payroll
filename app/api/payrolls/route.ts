import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createPayroll } from "@/lib/payrolls";
import { deletePayroll, getPayrolls } from "@/firebase/payrolls";

export const GET = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  try {
    const payrolls = await getPayrolls({
      month: parseInt(month || ""),
      year: parseInt(year || ""),
    });

    return NextResponse.json(payrolls);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ data }, { status: res.status });
    }
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
    await createPayroll(body);
    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "POST error", err }, { status: 500 });
  }
  // }
  // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ message: "POST error", err }, { status: 500 });
  }
};
