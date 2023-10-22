import { importUsers } from "@/lib/users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = async (request: Request, res: Response) => {
  try {
    const req = await request.json(); // res now contains body
    const { employeeImportList } = req;

    await importUsers(employeeImportList);

    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return e;
  }
};
