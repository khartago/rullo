"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Mot de passe incorrect");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-20 max-w-sm glass rounded-2xl p-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-2 text-sm text-white/60">El Rulo Padel Cup</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className="mt-6 w-full rounded-lg bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-rullo-mint"
      />
      {error && <p className="mt-2 text-sm text-rullo-pink">{error}</p>}
      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-rullo-pink py-3 font-semibold"
      >
        Connexion
      </button>
    </form>
  );
}
