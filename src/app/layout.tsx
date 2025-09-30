// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Guild Tracker",
  description: "Track ChipWar, Boss Hunt, and Sudden PvP points",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <div className="flex gap-4">
              <Link href="/" className="font-semibold">
                Guild Tracker
              </Link>
              <Link href="/checkin">Check-in</Link>
              <Link href="/leaderboard">Leaderboard</Link>
            </div>
            <div>
              <Link href="/api/auth/signin">Sign in with Discord</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
