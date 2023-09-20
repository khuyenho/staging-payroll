import { getActiveUsers } from "@/lib/users";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  // const session = await getServerSession(authOptions);
  // if (session) {
  try {
    const users = await getActiveUsers();

    return NextResponse.json(users);

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
