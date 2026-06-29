"use client";

import { useMemo, useState } from "react";
import type { Match } from "@prisma/client";
import { formatTeamLabel, cn } from "@/lib/utils";

type MatchWithMeta = Match & {
  bracketPhase?: {
    phase?: string;
    category?: { nameFr: string; nameEn: string; slug: string };
  };
};

type FilterKey = "all" | "today" | "live" | "toScore";

function teamLabel(m: Match, side: "A" | "B") {
  if (side === "A") {
    return formatTeamLabel(m.teamAPlayer1, m.teamAPlayer2, m.isTeamABye);
  }
  return formatTeamLabel(m.teamBPlayer1, m.teamBPlayer2, m.isTeamBBye);
}

function isScorable(m: Match) {
  const a = teamLabel(m, "A");
  const b = teamLabel(m, "B");
  return (
    a !== "TBD" &&
    b !== "TBD" &&
    a !== "BYE" &&
    b !== "BYE" &&
    ["scheduled", "live", "postponed"].includes(m.status)
  );
}

export function AdminDashboard({ matches }: { matches: MatchWithMeta[] }) {
  const [selected, setSelected] = useState<MatchWithMeta | null>(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<FilterKey>("toScore");
  const [categorySlug, setCategorySlug] = useState("");
  const [search, setSearch] = useState("");
  const [roundFilter, setRoundFilter] = useState<number | "">("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of matches) {
      const slug = m.bracketPhase?.category?.slug;
      const name = m.bracketPhase?.category?.nameFr;
      if (slug && name) map.set(slug, name);
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [matches]);

  const rounds = useMemo(() => {
    const set = new Set<number>();
    for (const m of matches) set.add(m.round);
    return Array.from(set).sort((a, b) => a - b);
  }, [matches]);

  const filtered = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const q = search.trim().toLowerCase();

    return matches.filter((m) => {
      if (categorySlug && m.bracketPhase?.category?.slug !== categorySlug)
        return false;
      if (roundFilter !== "" && m.round !== roundFilter) return false;
      if (filter === "live") return m.status === "live";
      if (filter === "toScore") return isScorable(m);
      if (filter === "today") {
        if (!m.scheduledAt) return false;
        const d = new Date(m.scheduledAt);
        return d >= today && d < tomorrow;
      }
      if (q) {
        const hay = [
          m.teamAPlayer1,
          m.teamAPlayer2,
          m.teamBPlayer1,
          m.teamBPlayer2,
          m.bracketPhase?.category?.nameFr,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [matches, filter, categorySlug, roundFilter, search]);

  const grouped = useMemo(() => {
    const groups = new Map<string, MatchWithMeta[]>();
    for (const m of filtered) {
      const phase =
        m.bracketPhase?.phase === "qualification" ? "Qualif" : "Final";
      const key = `${m.bracketPhase?.category?.nameFr ?? "?"} · ${phase} · T${m.round}`;
      const list = groups.get(key) ?? [];
      list.push(m);
      groups.set(key, list);
    }
    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
  }, [filtered]);

  function toggleGroup(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="mt-1 text-sm text-white/50">
            {filtered.length} match{filtered.length !== 1 ? "s" : ""} · saisie
            scores live
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "logout" }),
            });
            window.location.reload();
          }}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
        >
          Déconnexion
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["toScore", "À scorer"],
              ["live", "LIVE"],
              ["today", "Aujourd'hui"],
              ["all", "Tous"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition",
                filter === key
                  ? "bg-rullo-pink text-white"
                  : "bg-white/10 hover:bg-white/15",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Rechercher un joueur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rullo-mint/40"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm"
        >
          <option value="">Toutes catégories</option>
          {categories.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={roundFilter}
          onChange={(e) =>
            setRoundFilter(e.target.value ? Number(e.target.value) : "")
          }
          className="rounded-lg bg-white/10 px-3 py-2 text-sm"
        >
          <option value="">Tous les tours</option>
          {rounds.map((r) => (
            <option key={r} value={r}>
              Tour {r}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p className="mt-4 rounded-lg bg-rullo-mint/20 px-4 py-2 text-rullo-mint">
          {message}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="custom-scrollbar max-h-[calc(100vh-14rem)] space-y-3 overflow-y-auto pr-2">
          {grouped.length === 0 ? (
            <p className="rounded-xl bg-white/5 p-6 text-center text-white/50">
              Aucun match pour ce filtre
            </p>
          ) : (
            grouped.map(([group, groupMatches]) => {
              const isOpen = !collapsed[group];
              return (
                <div key={group} className="rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-rullo-bronze">
                      {group}
                    </span>
                    <span className="text-xs text-white/40">
                      {groupMatches.length} · {isOpen ? "▾" : "▸"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="space-y-1 border-t border-white/10 p-2">
                      {groupMatches.map((match) => {
                        const a = teamLabel(match, "A");
                        const b = teamLabel(match, "B");
                        const active = selected?.id === match.id;
                        return (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => setSelected(match)}
                            className={cn(
                              "w-full rounded-lg px-3 py-2.5 text-left transition",
                              active
                                ? "bg-rullo-pink/25 ring-1 ring-rullo-pink"
                                : "hover:bg-white/5",
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-white/40">
                                M{match.position}
                                {match.court ? ` · C${match.court}` : ""}
                              </span>
                              {match.status === "live" && (
                                <span className="live-pulse text-[10px] font-bold text-rullo-pink">
                                  LIVE
                                </span>
                              )}
                            </div>
                            <p className="mt-1 truncate text-sm font-medium">
                              {a}
                            </p>
                            <p className="truncate text-xs text-white/50">
                              vs {b}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="lg:sticky lg:top-20">
          {selected ? (
            <ScoreForm
              match={selected}
              onSaved={(msg) => {
                setMessage(msg);
              }}
              onClose={() => setSelected(null)}
            />
          ) : (
            <div className="glass rounded-2xl p-8 text-center text-white/50">
              <p className="text-lg">Sélectionnez un match</p>
              <p className="mt-2 text-sm">
                Filtre « À scorer » = matchs avec les deux équipes connues
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreForm({
  match,
  onSaved,
  onClose,
}: {
  match: MatchWithMeta;
  onSaved: (msg: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    set1A: match.set1A?.toString() ?? "",
    set1B: match.set1B?.toString() ?? "",
    set2A: match.set2A?.toString() ?? "",
    set2B: match.set2B?.toString() ?? "",
    set3A: match.set3A?.toString() ?? "",
    set3B: match.set3B?.toString() ?? "",
    superTbA: match.superTbA?.toString() ?? "",
    superTbB: match.superTbB?.toString() ?? "",
    court: match.court?.toString() ?? "",
    status: match.status,
    scheduledAt: match.scheduledAt
      ? new Date(match.scheduledAt).toISOString().slice(0, 16)
      : "",
    winnerSide: match.winnerSide ?? "",
  });

  const teamA = teamLabel(match, "A");
  const teamB = teamLabel(match, "B");

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(walkover?: "A" | "B") {
    const res = await fetch("/api/matches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: match.id,
        set1A: num(form.set1A),
        set1B: num(form.set1B),
        set2A: num(form.set2A),
        set2B: num(form.set2B),
        set3A: num(form.set3A),
        set3B: num(form.set3B),
        superTbA: num(form.superTbA),
        superTbB: num(form.superTbB),
        court: num(form.court),
        status: walkover ? "walkover" : form.status,
        winnerSide: walkover ?? (form.winnerSide || undefined),
        scheduledAt: form.scheduledAt || null,
      }),
    });
    if (res.ok) {
      onSaved("Score enregistré ✓");
      window.location.reload();
    }
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-rullo-bronze">
            {match.bracketPhase?.category?.nameFr} · T{match.round} M
            {match.position}
          </p>
          <h2 className="mt-1 font-bold">Saisie score</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 rounded-lg bg-white/5 p-3 text-sm">
        <p className="font-medium text-rullo-mint">{teamA}</p>
        <p className="my-1 text-center text-xs text-white/40">vs</p>
        <p className="font-medium">{teamB}</p>
      </div>

      <label className="mt-4 block text-xs text-white/50">Date / heure</label>
      <input
        type="datetime-local"
        value={form.scheduledAt}
        onChange={(e) => updateField("scheduledAt", e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm"
      />

      <label className="mt-3 block text-xs text-white/50">Statut</label>
      <select
        value={form.status}
        onChange={(e) => updateField("status", e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm"
      >
        <option value="scheduled">À venir</option>
        <option value="live">En cours</option>
        <option value="completed">Terminé</option>
        <option value="walkover">WO</option>
        <option value="postponed">Reporté</option>
        <option value="cancelled">Annulé</option>
      </select>

      <p className="mt-4 text-xs font-medium text-white/50">Sets</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <ScoreInput label="S1 A" value={form.set1A} onChange={(v) => updateField("set1A", v)} />
        <ScoreInput label="S1 B" value={form.set1B} onChange={(v) => updateField("set1B", v)} />
        <ScoreInput label="S2 A" value={form.set2A} onChange={(v) => updateField("set2A", v)} />
        <ScoreInput label="S2 B" value={form.set2B} onChange={(v) => updateField("set2B", v)} />
        <ScoreInput label="S3 A" value={form.set3A} onChange={(v) => updateField("set3A", v)} />
        <ScoreInput label="S3 B" value={form.set3B} onChange={(v) => updateField("set3B", v)} />
        <ScoreInput label="STB A" value={form.superTbA} onChange={(v) => updateField("superTbA", v)} />
        <ScoreInput label="STB B" value={form.superTbB} onChange={(v) => updateField("superTbB", v)} />
      </div>

      <label className="mt-3 block text-xs text-white/50">Court</label>
      <input
        type="number"
        value={form.court}
        onChange={(e) => updateField("court", e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2"
      />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => save()}
          className="col-span-2 rounded-lg bg-rullo-mint py-2.5 font-semibold text-rullo-dark"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => save("A")}
          className="rounded-lg bg-white/10 py-2 text-xs"
        >
          WO {teamA.split(" / ")[0]?.split(" ").pop()}
        </button>
        <button
          type="button"
          onClick={() => save("B")}
          className="rounded-lg bg-white/10 py-2 text-xs"
        >
          WO {teamB.split(" / ")[0]?.split(" ").pop()}
        </button>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/matches", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ matchId: match.id, status: "live" }),
            });
            window.location.reload();
          }}
          className="col-span-2 rounded-lg bg-rullo-pink py-2 text-sm font-medium"
        >
          Marquer LIVE
        </button>
      </div>
    </div>
  );
}

function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] text-white/40">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-lg bg-white/10 px-2 py-1.5 text-center text-sm"
      />
    </div>
  );
}

function num(v: string | number | ""): number | null {
  if (v === "" || v == null) return null;
  return Number(v);
}
