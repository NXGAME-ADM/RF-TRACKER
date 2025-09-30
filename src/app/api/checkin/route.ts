import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function postToDiscord(content: string) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;
  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const discordId = (session as any).discordId as string;

  const user = await prisma.user.upsert({
    where: { id: discordId },
    update: {},
    create: {
      id: discordId,
      discordId,
      name: session.user?.name || "Member",
      image: session.user?.image || undefined,
    },
  });

  const { code } = await req.json();
  const normalized = String(code || "").trim().toUpperCase();

  const found = await prisma.code.findUnique({ where: { code: normalized } });
  if (!found || !found.isActive) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }
  if (found.expiresAt && found.expiresAt < new Date()) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }
  if (found.maxUses && found.usedCount >= found.maxUses) {
    return NextResponse.json({ error: "Code fully used" }, { status: 400 });
  }

  const existing = await prisma.attendance.findUnique({
    where: { userId_eventId: { userId: user.id, eventId: found.eventId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Already checked in for this event" },
      { status: 400 }
    );
  }

  await prisma.attendance.create({
    data: { userId: user.id, eventId: found.eventId },
  });

  await prisma.code.update({
    where: { id: found.id },
    data: { usedCount: { increment: 1 } },
  });

  const event = await prisma.event.findUnique({ where: { id: found.eventId } });
  await postToDiscord(
    `✅ **${user.name}** checked in for **${event?.type}** (+${event?.points} pts)`
  );

  return NextResponse.json({
    message: `Checked in for ${event?.type} (+${event?.points} pts)`,
  });
}
