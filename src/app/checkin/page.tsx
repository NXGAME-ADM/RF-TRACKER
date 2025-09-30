"use client";
import { useState } from "react";

export default function CheckInPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Failed.");
    } else {
      setMessage(`✅ ${data.message}`);
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Enter Event Code</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. CW-SEP30"
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2"
        />
        <button className="rounded-xl bg-green-600 px-4 py-2">Check in</button>
      </form>
      {message && <p>{message}</p>}
      <p className="text-sm text-slate-400">
        You must be signed in with Discord. Your points update instantly.
      </p>
    </div>
  );
}
