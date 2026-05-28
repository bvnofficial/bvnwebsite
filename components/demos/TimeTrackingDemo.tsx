"use client";
import { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle2, Users, DollarSign, AlertCircle } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  initials: string;
  color: string;
  role: string;
  status: "in" | "out" | "break";
  clockedIn: string | null;
  hours: string;
  location: string;
  lat: number;
  lng: number;
}

const employees: Employee[] = [
  { id: 1, name: "Anna Cruz", initials: "AC", color: "bg-pink-500", role: "Marketing Manager", status: "in", clockedIn: "8:02 AM", hours: "8h 14m", location: "BGC Office", lat: 14.5547, lng: 121.0466 },
  { id: 2, name: "Ben Santos", initials: "BS", color: "bg-blue-500", role: "Developer", status: "in", clockedIn: "8:48 AM", hours: "7h 28m", location: "Remote — Cebu", lat: 10.3157, lng: 123.8854 },
  { id: 3, name: "Clara Reyes", initials: "CR", color: "bg-purple-500", role: "Designer", status: "break", clockedIn: "9:01 AM", hours: "6h 55m", location: "BGC Office", lat: 14.5547, lng: 121.0466 },
  { id: 4, name: "Dan Lim", initials: "DL", color: "bg-orange", role: "Sales Executive", status: "in", clockedIn: "7:45 AM", hours: "8h 31m", location: "Client Visit — Makati", lat: 14.5547, lng: 121.0244 },
  { id: 5, name: "Eva Torres", initials: "ET", color: "bg-green-500", role: "Admin Officer", status: "out", clockedIn: null, hours: "0h 00m", location: "—", lat: 0, lng: 0 },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const weekHours = [
  [8.2, 8.0, 7.5, 8.5, 8.1],
  [7.9, 8.2, 8.4, 7.8, 8.0],
  [8.5, 0, 8.1, 7.9, 7.5],
  [8.8, 8.3, 8.1, 8.6, 0],
  [0, 0, 0, 0, 0],
];

const statusColors: Record<string, string> = {
  in: "bg-green-400 text-green-400",
  out: "bg-red-400 text-red-400",
  break: "bg-yellow-400 text-yellow-400",
};

export default function TimeTrackingDemo() {
  const [myStatus, setMyStatus] = useState<"out" | "in" | "break">("out");
  const [clockTime, setClockTime] = useState("");
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [activeTab, setActiveTab] = useState<"live" | "timesheet" | "payroll">("live");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      if (myStatus === "in") setElapsedSecs((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [myStatus]);

  function formatElapsed(secs: number) {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function clockIn() { setMyStatus("in"); setElapsedSecs(0); }
  function clockOut() { setMyStatus("out"); }
  function takeBreak() { setMyStatus("break"); }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["live", "timesheet", "payroll"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "live" ? "🟢 Live Status" : tab === "timesheet" ? "📊 Timesheets" : "💰 Payroll Sync"}
          </button>
        ))}
      </div>

      {/* Live Status */}
      {activeTab === "live" && (
        <>
          {/* My Clock */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-4">⏱ My Time Clock</h4>
            <div className="text-center mb-4">
              <div className="font-heading font-extrabold text-4xl text-white tracking-widest">{clockTime || "09:16:42"}</div>
              {myStatus === "in" && (
                <div className="text-green-400 text-sm font-semibold mt-1">
                  ⏱ Elapsed: {formatElapsed(elapsedSecs)}
                </div>
              )}
              <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${myStatus === "in" ? "bg-green-400/10 text-green-400" : myStatus === "break" ? "bg-yellow-400/10 text-yellow-400" : "bg-red-400/10 text-red-400"}`}>
                <div className={`w-2 h-2 rounded-full ${statusColors[myStatus].split(" ")[0]} ${myStatus === "in" ? "animate-pulse" : ""}`} />
                {myStatus === "in" ? "Clocked In" : myStatus === "break" ? "On Break" : "Clocked Out"}
              </div>
            </div>
            <div className="flex gap-2">
              {myStatus === "out" ? (
                <button onClick={clockIn} className="flex-1 py-3 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
                  <Clock size={15} /> Clock In
                </button>
              ) : (
                <>
                  {myStatus !== "break" && (
                    <button onClick={takeBreak} className="flex-1 py-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-bold rounded-xl hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2">
                      ☕ Take Break
                    </button>
                  )}
                  {myStatus === "break" && (
                    <button onClick={clockIn} className="flex-1 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold rounded-xl hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
                      ▶ Resume
                    </button>
                  )}
                  <button onClick={clockOut} className="flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2">
                    <Clock size={15} /> Clock Out
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-3 justify-center text-white/30 text-[10px]">
              <MapPin size={11} className="text-orange" />
              <span>Location verified: BGC, Taguig City ✓</span>
            </div>
          </div>

          {/* Team Status */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading font-bold text-white text-sm">Team Status</h4>
              <div className="flex gap-3 text-[10px]">
                <span className="text-green-400">{employees.filter(e => e.status === "in").length} in</span>
                <span className="text-yellow-400">{employees.filter(e => e.status === "break").length} break</span>
                <span className="text-red-400">{employees.filter(e => e.status === "out").length} out</span>
              </div>
            </div>
            <div className="space-y-2">
              {employees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {emp.initials}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-navy-dark ${statusColors[emp.status].split(" ")[0]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs font-semibold">{emp.name}</p>
                    <div className="flex items-center gap-1 text-[9px] text-white/30">
                      <MapPin size={8} />
                      <span>{emp.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {emp.status !== "out" ? (
                      <>
                        <p className="text-white/60 text-xs font-semibold">{emp.hours}</p>
                        <p className="text-white/25 text-[9px]">In: {emp.clockedIn}</p>
                      </>
                    ) : (
                      <span className="text-red-400/60 text-[10px]">Not clocked in</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Timesheets */}
      {activeTab === "timesheet" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="font-heading font-bold text-white text-sm mb-3">Weekly Timesheet</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr>
                  <th className="text-white/40 font-semibold text-left pb-2 text-[10px] w-28">Employee</th>
                  {weekDays.map((d) => <th key={d} className="text-white/40 font-semibold pb-2 text-center text-[10px]">{d}</th>)}
                  <th className="text-white/40 font-semibold pb-2 text-right text-[10px]">Total</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, ei) => {
                  const hours = weekHours[ei];
                  const total = hours.reduce((s, h) => s + h, 0).toFixed(1);
                  return (
                    <tr key={emp.id} className="border-t border-white/5">
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full ${emp.color} flex items-center justify-center text-white text-[8px] font-bold`}>{emp.initials}</div>
                          <span className="text-white/70 text-[10px]">{emp.name.split(" ")[0]}</span>
                        </div>
                      </td>
                      {hours.map((h, i) => (
                        <td key={i} className="text-center py-2.5">
                          <span className={`text-[10px] font-semibold ${h === 0 ? "text-red-400/50" : h < 7 ? "text-yellow-400/70" : "text-white/60"}`}>
                            {h > 0 ? h.toFixed(1) : "—"}
                          </span>
                        </td>
                      ))}
                      <td className="text-right py-2.5 font-bold text-white/80 text-[10px]">{total}h</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Total Hours (Team)", val: "192.4h" },
              { label: "Overtime", val: "8.2h" },
              { label: "Accuracy Rate", val: "99.8%" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <div className="font-heading font-bold text-base text-white">{val}</div>
                <div className="text-white/30 text-[10px]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Sync */}
      {activeTab === "payroll" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Payroll Integration Status</h4>
            {[
              { system: "BIR Tax Filing", status: "synced", lastSync: "Today 8:00 AM", icon: "🏛" },
              { system: "SSS / PhilHealth / Pag-IBIG", status: "synced", lastSync: "Today 8:00 AM", icon: "🏥" },
              { system: "Bank Payroll Transfer", status: "pending", lastSync: "Processing...", icon: "🏦" },
              { system: "Accounting (QuickBooks)", status: "synced", lastSync: "Today 8:01 AM", icon: "📊" },
              { system: "HR Records", status: "synced", lastSync: "Real-time", icon: "👥" },
            ].map(({ system, status, lastSync, icon }) => (
              <div key={system} className="flex items-center gap-3 py-2.5 border-b border-white/5">
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <p className="text-white/70 text-xs font-semibold">{system}</p>
                  <p className="text-white/30 text-[10px]">Last sync: {lastSync}</p>
                </div>
                {status === "synced" ? (
                  <span className="flex items-center gap-1 text-green-400 text-[10px] font-semibold">
                    <CheckCircle2 size={11} /> Synced
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400 text-[10px] font-semibold">
                    <AlertCircle size={11} /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Before: Payroll Processing", val: "3 full days" },
              { label: "After: Payroll Processing", val: "2 hours" },
              { label: "Manual Entry Errors", val: "0 (was 8%)" },
              { label: "Employee Self-Service", val: "✅ Enabled" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-white/40 text-[9px] uppercase tracking-widest mb-1">{label.includes("Before") ? "⚠️ Before" : label.includes("After") ? "✅ After" : ""}</div>
                <div className={`font-heading font-bold text-sm ${label.includes("After") || label.includes("Errors") || label.includes("Self") ? "text-green-400" : "text-white/60"}`}>{val}</div>
                <div className="text-white/30 text-[10px]">{label.replace("Before: ", "").replace("After: ", "")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
