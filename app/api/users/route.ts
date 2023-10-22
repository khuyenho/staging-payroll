import { getActiveUsers } from "@/lib/users";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const users = await getActiveUsers();

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ message: "GET error", err }, { status: 500 });
  }
};
