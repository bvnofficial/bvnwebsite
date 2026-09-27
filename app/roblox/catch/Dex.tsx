"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { MONSTERS, type Monster } from "./monsters";
import { FINISHES, RARITIES, SKILL_BLURB, rarityColor, rarityName } from "./data";

const PAGE = 36;
const pic = (m: Monster, evolved = false) => (evolved ? `/roblox/catch/evo/${m.id}.webp` : `/roblox/catch/mon/${m.id}.webp`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Dex() {
  const [q, setQ] = useState("");
  const [rar, setRar] = useState<string>("all");
  const [set, setSet] = useState<string>("all");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const [evolved, setEvolved] = useState(false);

  const sets = useMemo(() => Array.from(new Set(MONSTERS.map((m) => m.set))).sort(), []);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return MONSTERS.filter(
      (m) =>
        (rar === "all" || m.rarity === rar) &&
        (set === "all" || m.set === set) &&
        (!t || m.name.toLowerCase().includes(t) || m.set.toLowerCase().includes(t) || m.element.toLowerCase().includes(t)),
    );
  }, [q, rar, set]);

  useEffect(() => setShown(PAGE), [q, rar, set]);

  const current = open === null ? null : list[open];
  const step = useCallback(
    (d: number) => {
      setEvolved(false);
      setOpen((o) => (o === null ? o : (o + d + list.length) % list.length));
    },
    [list.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  return (
    <div>
      <div className="ct-dex-bar">
        <input
          className="ct-search"
          placeholder="Search 190 monsters..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search monsters"
        />
        <select className="ct-select" value={set} onChange={(e) => setSet(e.target.value)} aria-label="Filter by set">
          <option value="all">Every set</option>
          {sets.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="ct-chips">
        <button className={`ct-chip ${rar === "all" ? "on" : ""}`} style={rar === "all" ? { background: "#fffdf5" } : undefined} onClick={() => setRar("all")}>
          ALL
        </button>
        {RARITIES.map((r) => (
          <button
            key={r.id}
            className={`ct-chip ${rar === r.id ? "on" : ""}`}
            style={rar === r.id ? { background: r.color } : { borderColor: r.color }}
            onClick={() => setRar(r.id)}
          >
            {r.name.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="ct-dex-count">
        Showing {Math.min(shown, list.length)} of {list.length} monsters. Tap one to see its evolved form.
      </p>

      <div className="ct-grid">
        {list.slice(0, shown).map((m, i) => (
          <button
            key={m.id}
            className="ct-card"
            style={{ ["--rc" as string]: rarityColor(m.rarity) }}
            onClick={() => {
              setEvolved(false);
              setOpen(i);
            }}
          >
            <img src={pic(m)} alt={m.name} loading="lazy" width={256} height={256} />
            <div className="nm">{m.name}</div>
            <span className="rr" style={{ background: rarityColor(m.rarity) }}>{rarityName(m.rarity)}</span>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="ct-dex-count" style={{ marginTop: 20 }}>No monster by that name. Yet.</p>}
      {shown < list.length && (
        <div className="ct-more">
          <button className="ct-btn pink" onClick={() => setShown((s) => s + PAGE * 2)}>
            SHOW MORE MONSTERS ({list.length - shown} left)
          </button>
        </div>
      )}

      {current && (
        <div className="ct-modal" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={current.name}>
          <div className="ct-modal-box" onClick={(e) => e.stopPropagation()} style={{ ["--rc" as string]: rarityColor(current.rarity) + "66" }}>
            <button className="ct-x" onClick={() => setOpen(null)} aria-label="Close">X</button>
            <div className="ct-modal-art">
              <img key={current.id + String(evolved)} src={pic(current, evolved)} alt={`${current.name}${evolved ? " evolved" : ""}`} width={280} height={280} />
              {current.evo && (
                <div className="ct-fins">
                  <button className={`ct-fin ${!evolved ? "on" : ""}`} style={{ background: "#fffdf5" }} onClick={() => setEvolved(false)}>NORMAL</button>
                  <button className={`ct-fin ${evolved ? "on" : ""}`} style={{ background: "#3ee6ff" }} onClick={() => setEvolved(true)}>EVOLVED</button>
                </div>
              )}
              <div className="ct-fins" style={{ marginTop: 8 }}>
                {FINISHES.filter((f) => current.finishes.includes(f.id)).map((f) => (
                  <span key={f.id} className="ct-fin on" style={{ background: f.color, cursor: "default", transform: "none", boxShadow: "none", fontSize: 10 }}>
                    {f.id} {f.mult > 1 ? `x${f.mult}` : ""}
                  </span>
                ))}
              </div>
            </div>
            <div className="ct-modal-info">
              <span className="rr" style={{ display: "inline-block", fontWeight: 900, fontSize: 13, padding: "3px 10px", borderRadius: 9, border: "2px solid #0b0618", color: "#0b0618", background: rarityColor(current.rarity) }}>
                {rarityName(current.rarity).toUpperCase()}
              </span>
              <h3 className="stroke" style={{ color: rarityColor(current.rarity), marginTop: 10 }}>{current.name}</h3>
              <dl>
                <dt>Set</dt>
                <dd>{current.set}</dd>
                <dt>Element</dt>
                <dd>{current.element}</dd>
                <dt>Skill</dt>
                <dd>{current.skill}</dd>
                <dt>Attack</dt>
                <dd>{cap(current.attack)}</dd>
                <dt>Special</dt>
                <dd>{cap(current.special)}</dd>
                <dt>Finishes</dt>
                <dd>{current.finishes.length} (tinted looks worth more)</dd>
              </dl>
              <p className="blurb">
                <b>{current.skill}:</b> {SKILL_BLURB[current.skill] ?? ""} Make {current.name} one of your three Pal Pets to get it.
              </p>
              <div className="ct-nav-arrows">
                <button className="ct-btn small cyan" onClick={() => step(-1)}>PREV</button>
                <button className="ct-btn small" onClick={() => step(1)}>NEXT</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
