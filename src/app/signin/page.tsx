// src/app/signin/page.tsx
export default function SignInPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <a
        className="inline-block bg-indigo-600 px-4 py-2 rounded-xl"
        href="/api/auth/signin"
      >
        Sign in with Discord
      </a>
    </div>
  );
}
