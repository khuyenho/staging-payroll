import { NextResponse } from "next/server";
import {
  getPayrollById,
  deletePayrollById,
  updatePayrollStatus,
} from "@/lib/payrolls";

export const GET = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  try {
    const payroll = await getPayrollById(parseInt(id));
    return NextResponse.json(payroll);
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
  // }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};

export const DELETE = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  try {
    const payroll = await deletePayrollById(parseInt(id));

    return NextResponse.json(payroll);
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
    try {
      const res = await updatePayrollStatus(parseInt(payrollId));
    } catch (err) {
      console.log(err);
    }
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ message: "PUT error", err }, { status: 500 });
  }
  // }
  return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};

// export const POST = async (req: Request) => {
//   //   const session = await getServerSession(authOptions);
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
