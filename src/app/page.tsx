import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Guild Tracker</h1>
      <p>
        Track ChipWar, Boss Hunt, and Sudden PvP attendance with Discord login
        and event codes.
      </p>
      <div className="flex gap-3">
        <Link
          href="/checkin"
          className="rounded-xl px-4 py-2 bg-slate-800"
        >
          Check-in
        </Link>
        <Link
          href="/leaderboard"
          className="rounded-xl px-4 py-2 bg-slate-800"
        >
          View Leaderboard
        </Link>
        <Link
          href="/admin"
          className="rounded-xl px-4 py-2 bg-indigo-700"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
