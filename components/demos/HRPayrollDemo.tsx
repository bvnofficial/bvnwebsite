"use client";
import { useState } from "react";
import { Users, DollarSign, Clock, CheckCircle2, UserPlus, Calendar } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  dept: string;
  hours: number;
  rate: number;
  status: "active" | "leave" | "remote";
  initials: string;
  color: string;
  attendance: Record<string, "present" | "leave" | "remote" | "absent">;
}

const deptColors: Record<string, string> = {
  Marketing: "bg-pink-400/20 text-pink-300",
  Engineering: "bg-blue-400/20 text-blue-300",
  Design: "bg-purple-400/20 text-purple-300",
  Sales: "bg-orange/20 text-orange",
  Admin: "bg-green-400/20 text-green-300",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const initialEmployees: Employee[] = [
  { id: 1, name: "Anna Cruz", role: "Marketing Manager", dept: "Marketing", hours: 160, rate: 25, status: "active", initials: "AC", color: "bg-pink-500",
    attendance: { Mon: "present", Tue: "present", Wed: "remote", Thu: "present", Fri: "present" } },
  { id: 2, name: "Ben Santos", role: "Lead Developer", dept: "Engineering", hours: 160, rate: 35, status: "active", initials: "BS", color: "bg-blue-500",
    attendance: { Mon: "present", Tue: "present", Wed: "present", Thu: "remote", Fri: "present" } },
  { id: 3, name: "Clara Reyes", role: "UI/UX Designer", dept: "Design", hours: 120, rate: 28, status: "leave", initials: "CR", color: "bg-purple-500",
    attendance: { Mon: "leave", Tue: "leave", Wed: "leave", Thu: "leave", Fri: "leave" } },
  { id: 4, name: "Dan Lim", role: "Sales Executive", dept: "Sales", hours: 160, rate: 22, status: "active", initials: "DL", color: "bg-orange",
    attendance: { Mon: "present", Tue: "absent", Wed: "present", Thu: "present", Fri: "remote" } },
  { id: 5, name: "Eva Torres", role: "Admin Officer", dept: "Admin", hours: 80, rate: 18, status: "remote", initials: "ET", color: "bg-green-500",
    attendance: { Mon: "remote", Tue: "remote", Wed: "remote", Thu: "remote", Fri: "remote" } },
];

const leaveRequests = [
  { name: "Anna Cruz", type: "Vacation", dates: "Jun 15–17", days: 3, status: "pending" as const, initials: "AC", color: "bg-pink-500" },
  { name: "Ben Santos", type: "Sick Leave", dates: "Jun 10", days: 1, status: "approved" as const, initials: "BS", color: "bg-blue-500" },
  { name: "Clara Reyes", type: "Personal Leave", dates: "Jun 9–13", days: 5, status: "approved" as const, initials: "CR", color: "bg-purple-500" },
  { name: "Dan Lim", type: "Emergency", dates: "Jun 8", days: 1, status: "pending" as const, initials: "DL", color: "bg-orange" },
];

const attColors: Record<string, string> = {
  present: "bg-green-400",
  leave: "bg-yellow-400",
  remote: "bg-blue-400",
  absent: "bg-red-400",
};

export default function HRPayrollDemo() {
  const [employees] = useState(initialEmployees);
  const [requests, setRequests] = useState(leaveRequests);
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"payroll" | "attendance" | "leave">("payroll");

  const totalPayroll = employees.reduce((s, e) => s + e.hours * e.rate, 0);
  const totalHours = employees.reduce((s, e) => s + e.hours, 0);

  function approve(i: number) {
    setRequests((prev) => prev.map((r, idx) => idx === i ? { ...r, status: "approved" as const } : r));
  }

  function runPayroll() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setProcessed(true); }, 2000);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Employees", val: employees.length.toString(), color: "text-white" },
          { icon: DollarSign, label: "Monthly Payroll", val: `$${(totalPayroll / 1000).toFixed(0)}K`, color: "text-green-400" },
          { icon: Clock, label: "Total Hours", val: totalHours.toString(), color: "text-blue-400" },
          { icon: Calendar, label: "Pending Leaves", val: requests.filter(r => r.status === "pending").length.toString(), color: "text-yellow-400" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <Icon size={14} className={`${color} mx-auto mb-1`} />
            <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
            <div className="text-white/40 text-[10px]">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["payroll", "attendance", "leave"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "payroll" ? "💰 Payroll" : tab === "attendance" ? "📅 Attendance" : "🏖 Leave Mgmt"}
          </button>
        ))}
      </div>

      {/* Payroll */}
      {activeTab === "payroll" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-bold text-white text-sm">May 2025 Payroll Run</h4>
            <button onClick={runPayroll} disabled={processed || processing}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5
                ${processed ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-orange text-white hover:bg-orange-light disabled:opacity-60"}`}>
              {processing ? (
                <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Processing...</>
              ) : processed ? <><CheckCircle2 size={12} /> Payroll Sent!</> : "▶ Run Payroll"}
            </button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-6 text-[10px] text-white/25 uppercase tracking-widest px-2 pb-1 font-semibold">
              <span className="col-span-2">Employee</span>
              <span className="text-center">Dept</span>
              <span className="text-center">Hours</span>
              <span className="text-center">Deductions</span>
              <span className="text-right">Net Pay</span>
            </div>
            {employees.map((e) => {
              const gross = e.hours * e.rate;
              const tax = Math.floor(gross * 0.22);
              const net = gross - tax;
              return (
                <div key={e.id} className={`grid grid-cols-6 items-center py-2.5 px-2 rounded-lg border transition-all ${processed ? "border-green-400/20 bg-green-400/3" : "border-white/5 bg-white/2"}`}>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${e.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                      {e.initials}
                    </div>
                    <div>
                      <div className="text-white/80 text-xs font-semibold">{e.name}</div>
                      <div className="text-white/30 text-[10px]">{e.role}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${deptColors[e.dept] || "bg-white/10 text-white/50"}`}>
                      {e.dept}
                    </span>
                  </div>
                  <div className="text-center text-white/50 text-xs">{e.hours}h</div>
                  <div className="text-center text-red-400/60 text-xs">-${tax}</div>
                  <div className={`text-right font-bold text-sm ${processed ? "text-green-400" : "text-white/70"}`}>
                    ${net.toLocaleString()}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white/40 text-xs">Total Net Payroll</span>
              <span className={`font-heading font-extrabold ${processed ? "text-green-400" : "text-white"}`}>
                ${employees.reduce((s, e) => s + Math.floor(e.hours * e.rate * 0.78), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Attendance */}
      {activeTab === "attendance" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-bold text-white text-sm">This Week&apos;s Attendance</h4>
            <div className="flex gap-3 text-[10px]">
              {[["bg-green-400", "Present"], ["bg-blue-400", "Remote"], ["bg-yellow-400", "Leave"], ["bg-red-400", "Absent"]].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-white/40">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr>
                  <th className="text-white/40 font-semibold text-left pb-2 text-[10px] w-36">Employee</th>
                  {days.map((d) => (
                    <th key={d} className="text-white/40 font-semibold pb-2 text-center text-[10px]">{d}</th>
                  ))}
                  <th className="text-white/40 font-semibold pb-2 text-right text-[10px]">Rate</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => {
                  const presentDays = Object.values(e.attendance).filter((v) => v === "present" || v === "remote").length;
                  return (
                    <tr key={e.id} className="border-t border-white/5">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${e.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                            {e.initials}
                          </div>
                          <div>
                            <div className="text-white/70 text-xs font-medium">{e.name.split(" ")[0]}</div>
                          </div>
                        </div>
                      </td>
                      {days.map((d) => {
                        const status = e.attendance[d] || "absent";
                        return (
                          <td key={d} className="text-center py-2.5">
                            <div className={`w-6 h-6 rounded-full ${attColors[status]} mx-auto flex items-center justify-center`}>
                              <span className="text-[8px] text-white font-bold">
                                {status === "present" ? "P" : status === "remote" ? "R" : status === "leave" ? "L" : "A"}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      <td className="text-right text-white/40 text-[10px] py-2.5">{presentDays}/5</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Management */}
      {activeTab === "leave" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm">Leave Requests</h4>
          {requests.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5">
              <div className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {r.initials}
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-xs font-semibold">{r.name}</p>
                <p className="text-white/40 text-[10px]">{r.type} · {r.dates} · {r.days} day{r.days > 1 ? "s" : ""}</p>
              </div>
              {r.status === "pending" ? (
                <div className="flex gap-1.5">
                  <button onClick={() => approve(i)}
                    className="px-2.5 py-1 bg-green-400/10 border border-green-400/20 text-green-400 text-[10px] font-bold rounded-lg hover:bg-green-400/20 transition-colors">
                    Approve
                  </button>
                  <button
                    className="px-2.5 py-1 bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-400/20 transition-colors">
                    Decline
                  </button>
                </div>
              ) : (
                <span className="text-green-400 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Approved
                </span>
              )}
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { label: "Annual Leave Balance", val: "12 days" },
              { label: "Sick Leave Used", val: "3 days" },
              { label: "Approval Pending", val: `${requests.filter(r => r.status === "pending").length} requests` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <div className="font-heading font-bold text-base text-white">{val}</div>
                <div className="text-white/30 text-[10px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
