import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: Request, res: Response) => {
  try {
    // Use the Prisma client to perform a raw query
    await prisma.$queryRawUnsafe("SELECT 1");

    // If the query is successful, return the status as connected
    return NextResponse.json({ status: "connected" });
  } catch (error) {
    // If the query fails, return the status as disconnected
    return NextResponse.json({ status: "disconnected", error });
  }
};
