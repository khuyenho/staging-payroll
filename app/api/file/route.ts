import { importFile } from "@/lib/transaction";
import { NextResponse } from "next/server";

export const POST = async (request: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {

  try {
    const req = await request.json(); // res now contains body
    const res = await importFile(req);
    return NextResponse.json(res);
  } catch (e) {
    console.log(e);
    return e;
  }
  return NextResponse.json(res);

  // }
  // return NextResponse.json({ error: "Unauthorized" }, { status: res.status });
};
