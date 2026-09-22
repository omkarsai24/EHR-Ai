import React, { useState } from "react";
import { DoctorProfile, EHRNotification } from "../types";
import { Search, Plus, Bell, ChevronDown, Stethoscope, Settings, CheckCircle2, AlertCircle, FileText, Smartphone } from "lucide-react";

interface HeaderProps {
  doctorProfile: DoctorProfile;
  onOpenProfileModal: () => void;
  onOpenPhoneSyncModal: () => void;
  notifications: EHRNotification[];
  onMarkNotificationRead: (id: string) => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  doctorProfile,
  onOpenProfileModal,
  onOpenPhoneSyncModal,
  notifications,
  onMarkNotificationRead,
  onSearchClick,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-xs">
      {/* Left Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
            MediCore <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
            MediCore AI ERP
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            onClick={onSearchClick}
            placeholder="Search patients, appointments, reports..."
            className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-inner"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Phone Link Sync Button */}
        <button
          onClick={onOpenPhoneSyncModal}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-xs font-semibold border border-blue-200 transition-colors"
          title="Connect iQOO Android Phone for DocAssist Pocket-EHR Voice Notes"
        >
          <Smartphone className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="hidden xl:inline">Phone Sync</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenPhoneSyncModal}
          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition-transform active:scale-95"
          title="Create New Consultation / Appointment"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Notifications ({unreadCount})
                </h3>
                <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 items-start ${
                      !notif.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {notif.type === "lab" && (
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    )}
                    {notif.type === "appointment" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    )}
                    {notif.type === "prescription" && (
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 font-medium leading-snug">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Top-Right Card (Interactive Customizer Trigger) */}
        <button
          onClick={onOpenProfileModal}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-blue-50/80 rounded-full border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer group"
          title="Click to edit Doctor Name, Designation, or Photo from files"
        >
          <img
            src={doctorProfile.photoUrl}
            alt={doctorProfile.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/80 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="text-left hidden sm:block">
            <h2 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
              {doctorProfile.name}
            </h2>
            <p className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">
              {doctorProfile.designation}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors ml-0.5" />
        </button>
      </div>
    </header>
  );
};
