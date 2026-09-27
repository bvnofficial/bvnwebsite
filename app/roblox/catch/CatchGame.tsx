"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { MONSTERS, type Monster } from "./monsters";
import { rarityColor, rarityName } from "./data";

// A tiny taste of the real thing: pick a sphere, throw, pray.
const RANK: Record<string, number> = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, divine: 6, ethereal: 7 };
const ODDS: [string, number][] = [["common", 38], ["rare", 26], ["epic", 16], ["legendary", 10], ["mythic", 6], ["divine", 3], ["ethereal", 1]];
const BALLS = [
  { id: "plain", name: "Plain", holds: 1 },
  { id: "keen", name: "Keen", holds: 2 },
  { id: "prime", name: "Prime", holds: 3 },
  { id: "nova", name: "Nova", holds: 5 },
  { id: "zenith", name: "Zenith", holds: 7 },
];

function roll(): Monster {
  let n = Math.random() * ODDS.reduce((a, [, w]) => a + w, 0);
  let rar = "common";
  for (const [r, w] of ODDS) {
    if ((n -= w) <= 0) {
      rar = r;
      break;
    }
  }
  const pool = MONSTERS.filter((m) => m.rarity === rar);
  return pool[Math.floor(Math.random() * pool.length)];
}

type Phase = "idle" | "throw" | "wiggle" | "win" | "lose" | "tore";

export default function CatchGame() {
  const [mon, setMon] = useState<Monster | null>(null);
  const [ball, setBall] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [misses, setMisses] = useState(0);
  const [bag, setBag] = useState<Monster[]>([]);
  const [throws, setThrows] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setMon(roll());
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const next = useCallback(() => {
    setMon(roll());
    setMisses(0);
    setPhase("idle");
  }, []);

  const toss = () => {
    if (!mon || phase !== "idle") return;
    const b = BALLS[ball];
    const rank = RANK[mon.rarity];
    setThrows((t) => t + 1);
    setPhase("throw");
    if (rank > b.holds) {
      later(() => setPhase("wiggle"), 700);
      later(() => setPhase("tore"), 1100);
      later(() => setPhase("idle"), 2600);
      return;
    }
    // Every miss wears it down, so the next throw has better odds.
    const chance = Math.min(0.92, 0.42 + 0.12 * (b.holds - rank) + 0.14 * misses);
    const caught = Math.random() < chance;
    later(() => setPhase("wiggle"), 700);
    later(() => {
      if (caught) {
        setPhase("win");
        setBag((bg) => [mon, ...bg].slice(0, 24));
        later(next, 1900);
      } else {
        setPhase("lose");
        setMisses((m) => m + 1);
        later(() => setPhase("idle"), 1500);
      }
    }, 2250);
  };

  const hidden = phase === "wiggle" || phase === "win";
  return (
    <div>
      <div className="ct-game">
        <div className="ct-game-stage">
          {mon && (
            <>
              <span className="ct-game-rar" style={{ background: rarityColor(mon.rarity) }}>
                WILD {rarityName(mon.rarity).toUpperCase()}: {mon.name}
              </span>
              <img className={`ct-game-mon ${hidden ? "gone" : ""}`} src={`/roblox/catch/mon/${mon.id}.webp`} alt={mon.name} width={180} height={180} />
            </>
          )}
          {phase !== "idle" && phase !== "win" && phase !== "lose" && phase !== "tore" && (
            <div className={`ct-sphere ${phase === "throw" ? "throw" : "wiggle"}`} />
          )}
          {phase === "win" && <div className="ct-sphere rest" />}
          {phase === "win" && <div className="ct-result win comic stroke">CAPTURE SUCCESS!</div>}
          {phase === "lose" && <div className="ct-result lose comic stroke">GOT AWAY!</div>}
          {phase === "tore" && <div className="ct-result lose comic stroke">TORE RIGHT OUT!</div>}
        </div>
        <div className="ct-game-bar">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BALLS.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setBall(i)}
                className="ct-chip"
                style={ball === i ? { background: "#ffd23f", color: "#0b0618", boxShadow: "0 4px 0 #0b0618" } : undefined}
                aria-pressed={ball === i}
              >
                <img src={`/roblox/catch/art/sphere-${b.id}.webp`} alt="" width={22} height={22} style={{ verticalAlign: -5, marginRight: 4 }} />
                {b.name.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="ct-btn pink" onClick={toss} disabled={phase !== "idle"}>
            THROW!
          </button>
        </div>
        <div className="ct-game-bar" style={{ borderTop: 0, paddingTop: 0 }}>
          <span className="info">
            Throws: <b>{throws}</b> &nbsp; Caught: <b>{bag.length}</b> &nbsp;
            {misses > 0 && phase === "idle" && <>It is getting tired: <b>+{misses * 14}%</b> catch chance</>}
          </span>
          <button className="ct-btn small cyan" onClick={next} disabled={phase !== "idle"}>
            FIND ANOTHER
          </button>
        </div>
      </div>
      <div className="ct-caught" aria-live="polite">
        {bag.map((m, i) => (
          <img key={m.id + i} src={`/roblox/catch/mon/${m.id}.webp`} alt={m.name} title={m.name} width={54} height={54} style={{ borderColor: rarityColor(m.rarity) }} />
        ))}
      </div>
    </div>
  );
}
