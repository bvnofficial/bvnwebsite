"use client";
import { useState } from "react";
import { Users, DollarSign, Clock, CheckCircle2 } from "lucide-react";

interface Employee { name: string; role: string; hours: number; rate: number; }

const initialEmployees: Employee[] = [
  { name: "Anna Cruz", role: "Marketing Manager", hours: 160, rate: 25 },
  { name: "Ben Santos", role: "Developer", hours: 160, rate: 35 },
  { name: "Clara Reyes", role: "Designer", hours: 120, rate: 28 },
  { name: "Dan Lim", role: "Sales Rep", hours: 160, rate: 22 },
  { name: "Eva Torres", role: "Admin", hours: 80, rate: 18 },
];

const leaveRequests = [
  { name: "Anna Cruz", type: "Vacation", days: 3, status: "pending" },
  { name: "Ben Santos", type: "Sick Leave", days: 1, status: "approved" },
  { name: "Clara Reyes", type: "Personal", days: 2, status: "pending" },
];

export default function HRPayrollDemo() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [requests, setRequests] = useState(leaveRequests);
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const totalPayroll = employees.reduce((s, e) => s + e.hours * e.rate, 0);

  function approve(i: number) {
    setRequests(prev => prev.map((r, idx) => idx === i ? { ...r, status: "approved" } : r));
  }

  function runPayroll() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setProcessed(true); }, 1800);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Users size={16} className="text-orange mx-auto mb-1" />
          <div className="font-heading font-extrabold text-xl text-white">{employees.length}</div>
          <div className="text-white/40 text-[10px]">Employees</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <DollarSign size={16} className="text-green-400 mx-auto mb-1" />
          <div className="font-heading font-extrabold text-xl text-green-400">${totalPayroll.toLocaleString()}</div>
          <div className="text-white/40 text-[10px]">Monthly Payroll</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Clock size={16} className="text-blue-400 mx-auto mb-1" />
          <div className="font-heading font-extrabold text-xl text-blue-400">{employees.reduce((s, e) => s + e.hours, 0)}</div>
          <div className="text-white/40 text-[10px]">Total Hours</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading font-bold text-white text-sm">💰 Payroll Processing</h4>
          <button onClick={runPayroll} disabled={processed || processing}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${processed ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-orange text-white hover:bg-orange-light"} disabled:opacity-60`}>
            {processing ? (
              <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Processing...</>
            ) : processed ? (
              <><CheckCircle2 size={12} /> Payroll Sent!</>
            ) : "▶ Run Payroll"}
          </button>
        </div>
        <div className="space-y-1.5">
          {employees.map((e, i) => {
            const gross = e.hours * e.rate;
            const tax = Math.floor(gross * 0.22);
            const net = gross - tax;
            return (
              <div key={i} className="grid grid-cols-5 items-center py-2 border-b border-white/5 text-xs">
                <div>
                  <div className="text-white/80 font-semibold">{e.name}</div>
                  <div className="text-white/30 text-[10px]">{e.role}</div>
                </div>
                <div className="text-center text-white/50">{e.hours}h</div>
                <div className="text-center text-white/50">${e.rate}/hr</div>
                <div className="text-center text-white/50 text-[10px]">-${tax} tax</div>
                <div className="text-right font-bold text-green-400">${net.toLocaleString()}</div>
              </div>
            );
          })}
          <div className="flex justify-between pt-2">
            <span className="text-white/40 text-xs">Total Net Payroll</span>
            <span className="font-heading font-extrabold text-green-400">${employees.reduce((s, e) => s + Math.floor(e.hours * e.rate * 0.78), 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-heading font-bold text-white text-sm mb-3">📋 Leave Requests</h4>
        <div className="space-y-2">
          {requests.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <span className="text-white/80 text-xs font-semibold">{r.name}</span>
                <span className="text-white/40 text-xs ml-2">{r.type} · {r.days} day{r.days > 1 ? "s" : ""}</span>
              </div>
              {r.status === "pending" ? (
                <button onClick={() => approve(i)} className="px-2.5 py-1 bg-orange/10 border border-orange/30 text-orange text-[10px] font-bold rounded-lg hover:bg-orange/20 transition-colors">
                  Approve
                </button>
              ) : (
                <span className="text-green-400 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Approved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
