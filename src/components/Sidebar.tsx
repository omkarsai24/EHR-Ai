import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Pill,
  FileSpreadsheet,
  Activity,
  Brain,
  MessageSquare,
  CheckSquare,
  BarChart3,
  Settings,
  Smartphone,
  Sparkles,
  ClipboardList
} from "lucide-react";

export type SidebarTab =
  | "dashboard"
  | "exam-summary"
  | "phone-sync"
  | "patients"
  | "appointments"
  | "prescriptions"
  | "lab-reports"
  | "ai-diagnosis"
  | "messages"
  | "tasks"
  | "analytics"
  | "settings";

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  draftCount: number;
}

interface NavItem {
  id: SidebarTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
  isAi?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  draftCount,
}) => {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "exam-summary", label: "Exam & Lab Summary", icon: Activity, highlight: true },
    { id: "phone-sync", label: "DocAssist Mobile Sync", icon: Smartphone, badge: draftCount > 0 ? `${draftCount} New` : undefined },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "lab-reports", label: "Lab Reports", icon: FileSpreadsheet },
    { id: "ai-diagnosis", label: "AI Diagnosis Support", icon: Brain, isAi: true },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: "3" },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 hidden lg:flex select-none">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
          Clinical Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as SidebarTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-white"
                      : item.isAi
                      ? "text-indigo-600 group-hover:text-indigo-700"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.id === "phone-sync"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.isAi && !isActive && (
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Phone Linking Banner (MediCore AI Mobile) */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-2xl border border-slate-800 shadow-md space-y-3 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold">MediCore AI Mobile</h3>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          Access patient data, appointments & voice notes on your iQOO Android phone.
        </p>

        <button
          onClick={() => onSelectTab("phone-sync")}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          DocAssist Pocket-EHR
        </button>

        <p className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-800/80">
          © 2026 MediCore AI ERP. All rights reserved.
        </p>
      </div>
    </aside>
  );
};
