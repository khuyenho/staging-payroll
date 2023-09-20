import { importUsers } from "@/lib/users";
import { NextResponse } from "next/server";

export const POST = async (request: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {

  try {
    const req = await request.json(); // res now contains body
    const { employeeImportList } = req;

    await importUsers(employeeImportList);

    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return e;
  }
  //   return NextResponse.json(res);

  // }
  // return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};
