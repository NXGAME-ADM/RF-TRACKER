import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session as any)?.isAdmin;
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { eventId, code } = await req.json();

  const event = await prisma.event.findUnique({ where: { id: String(eventId) } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const finalCode =
    (code && String(code).trim().toUpperCase()) ||
    `${event.type.substring(0, 2)}-${randomCode()}`;

  const created = await prisma.code.create({
    data: { code: finalCode, eventId: event.id },
  });

  return NextResponse.json({ code: created.code });
}
