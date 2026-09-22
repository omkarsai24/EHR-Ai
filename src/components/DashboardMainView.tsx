import React from "react";
import { DoctorProfile, Appointment, DraftNote, PatientRecord } from "../types";
import { InteractiveCalendar } from "./InteractiveCalendar";
import { Sparkles, Users, Calendar, FileText, Smartphone, ArrowUpRight, Clock, CheckCircle2, ChevronRight, Activity, Plus } from "lucide-react";

interface DashboardMainViewProps {
  doctorProfile: DoctorProfile;
  appointments: Appointment[];
  draftNotes: DraftNote[];
  patients: PatientRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenSummaryModal: () => void;
  onOpenPhoneSyncModal: () => void;
  onAddAppointmentClick: () => void;
  onSelectTab: (tab: any) => void;
}

export const DashboardMainView: React.FC<DashboardMainViewProps> = ({
  doctorProfile,
  appointments,
  draftNotes,
  patients,
  selectedDate,
  onSelectDate,
  onOpenSummaryModal,
  onOpenPhoneSyncModal,
  onAddAppointmentClick,
  onSelectTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Beta Feature Alert Banner (Matching Image 1) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-600/30 relative overflow-hidden">
        <div className="flex items-start gap-3.5 z-10">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold tracking-tight flex items-center gap-2">
              MediCore AI Features in Beta Mode!
            </h2>
            <p className="text-xs text-blue-100/90 max-w-3xl leading-relaxed">
              Experience the future of AI-driven Healthcare with MediCore AI. Our platform enhances patient care with real-time voice SOAP transcription, cross-platform Android mobile sync, and AI clinical summaries.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSummaryModal}
          className="px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 text-xs font-extrabold rounded-xl shadow-md transition-transform active:scale-95 shrink-0 z-10 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          Generate Summary
        </button>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Patients</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">2,845</h3>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12% this month
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Appointments Today</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{appointments.length}</h3>
            <span className="text-[10px] text-blue-600 font-bold mt-0.5 block">5 Confirmed</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={onOpenPhoneSyncModal}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs flex items-center justify-between cursor-pointer transition-all"
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Mobile Phone Sync</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{draftNotes.length} Drafts</h3>
            <span className="text-[10px] text-amber-600 font-bold mt-0.5 block">iQOO Android Paired</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => onSelectTab("exam-summary")}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs flex items-center justify-between cursor-pointer transition-all"
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Lab Exam Summary</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">CMP & TSH</h3>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Image 2 View Ready</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (8 cols), Right Column (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Appointments & Voice Synced Drafts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Appointments Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Today's Patient Schedule</h3>
                <p className="text-[10px] text-slate-400">Scheduled for {doctorProfile.name}</p>
              </div>

              <button
                onClick={() => onSelectTab("appointments")}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                View All Schedule <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {appointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={apt.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                      alt={apt.patientName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{apt.patientName}</h4>
                      <p className="text-[10px] text-slate-500">{apt.type} • Age: {apt.patientAge} ({apt.patientGender})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {apt.time}
                    </span>

                    <button
                      onClick={() => onSelectTab("patients")}
                      className="hidden sm:inline-flex px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                    >
                      Start Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Phone Synced Notes Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Synced Voice Notes from Phone</h3>
                  <p className="text-[10px] text-slate-400">DocAssist Mobile App (iQOO Android Device)</p>
                </div>
              </div>

              <button
                onClick={onOpenPhoneSyncModal}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Open Mobile Workbench <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {draftNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{note.patientName} ({note.patientAge}y {note.patientGender})</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                      {note.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{note.chiefComplaint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Working Interactive Calendar & Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Interactive Working Calendar */}
          <InteractiveCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            appointments={appointments}
            onAddAppointmentClick={onAddAppointmentClick}
          />

          {/* Quick Actions Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Quick Shortcuts
            </h3>

            <div className="space-y-2">
              <button
                onClick={onAddAppointmentClick}
                className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-blue-600" /> New Appointment</span>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                onClick={() => onSelectTab("exam-summary")}
                className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-600" /> Exam & Lab Summary (Image 2)</span>
                <ChevronRight className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={onOpenPhoneSyncModal}
                className="w-full p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-amber-600" /> Test Phone App Simulator</span>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
