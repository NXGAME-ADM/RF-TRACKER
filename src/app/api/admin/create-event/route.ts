import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session as any)?.isAdmin;
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type, points } = await req.json();

  const event = await prisma.event.create({
    data: { type: String(type), points: Number(points) || 1 },
  });

  return NextResponse.json({ event });
}
