import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthGate() {
  const { user, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (user) return <div className="mt-5 flex items-center justify-between rounded-xl bg-white/[.04] px-4 py-3 text-sm"><span className="text-white/60">Playing as {user.email}</span><button type="button" onClick={signOut} className="font-semibold text-lavender-300">Sign out</button></div>;

  return <form className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap" onSubmit={event => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Enter your email to sign in.");
      return;
    }
    if (signIn(normalizedEmail)) {
      setEmail("");
      setError("");
    }
  }}>
    <input aria-label="Email" type="email" required value={email} onChange={event => { setEmail(event.target.value); setError(""); }} placeholder="Save progress with your email" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm outline-none placeholder:text-white/35" />
    <button type="submit" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/75 hover:bg-white/10">Sign in</button>
    {error && <p role="alert" className="basis-full text-sm text-rose-300">{error}</p>}
  </form>;
}