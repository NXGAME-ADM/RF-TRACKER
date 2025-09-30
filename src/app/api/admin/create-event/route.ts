import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventType } from "@prisma/client"; // ✅ import the Prisma enum

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session as any)?.isAdmin;
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const rawType = String(body?.type || "").toUpperCase();

  // ✅ validate and coerce to enum
  const allowed = Object.values(EventType);
  if (!allowed.includes(rawType as EventType)) {
    return NextResponse.json(
      { error: `Invalid type. Use one of: ${allowed.join(", ")}` },
      { status: 400 }
    );
  }

  const points = Number(body?.points) || 1;

  const event = await prisma.event.create({
    data: { type: rawType as EventType, points },
  });

  return NextResponse.json({ event });
}