import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const rows = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      attendances: {
        select: {
          event: { select: { points: true } },
        },
      },
    },
  });

  const data = rows
    .map((u) => ({
      id: u.id,
      name: u.name ?? "Anonymous",
      image: u.image ?? "",
      points: u.attendances.reduce(
        (sum, a) => sum + a.event.points,
        0
      ),
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <ul className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
        {data.map((u, i) => (
          <li
            key={u.id}
            className="p-3 flex items-center gap-3"
          >
            <span className="w-6 text-right mr-2">{i + 1}</span>
            {u.image && (
              <img
                src={u.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="flex-1">{u.name}</span>
            <span className="font-semibold">{u.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
