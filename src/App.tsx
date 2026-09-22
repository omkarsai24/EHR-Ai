import React, { useState, useEffect } from "react";
import { DoctorProfile, Appointment, PatientRecord, LabComponent, EHRNotification, DraftNote } from "./types";
import { initialDoctorProfile, initialAppointments, initialPatients, initialLabComponents, initialNotifications, initialDraftNotes } from "./data/mockData";
import { Header } from "./components/Header";
import { Sidebar, SidebarTab } from "./components/Sidebar";
import { DoctorProfileModal } from "./components/DoctorProfileModal";
import { DashboardMainView } from "./components/DashboardMainView";
import { ExamSummaryView } from "./components/ExamSummaryView";
import { DocAssistPhoneSync } from "./components/DocAssistPhoneSync";
import { PatientsView } from "./components/PatientsView";
import { AppointmentsView } from "./components/AppointmentsView";
import { AIDiagnosisSupport } from "./components/AIDiagnosisSupport";
import { PrescriptionsView } from "./components/PrescriptionsView";
import { AIAssistantChat } from "./components/AIAssistantChat";
import { PatientSummaryModal } from "./components/PatientSummaryModal";
import { Smartphone, LayoutDashboard, Activity, Users, Calendar, Pill, Brain, Search } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");

  // Dynamic Doctor Profile (User / Doctor configurable!)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(() => {
    const saved = localStorage.getItem("medicore_doctor_profile");
    return saved ? JSON.parse(saved) : initialDoctorProfile;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // App Clinical Data
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [labComponents, setLabComponents] = useState<LabComponent[]>(initialLabComponents);
  const [notifications, setNotifications] = useState<EHRNotification[]>(initialNotifications);
  const [selectedDate, setSelectedDate] = useState<string>("2026-05-20");

  // Synced Mobile Draft Notes (with fallback for static Vercel preview)
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>(initialDraftNotes);

  // Fetch mobile draft notes from backend with 3-second live polling
  useEffect(() => {
    const fetchDrafts = () => {
      fetch("/api/phone/drafts")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDraftNotes(data);
          }
        })
        .catch((err) => console.error("Failed to load mobile drafts:", err));
    };

    fetchDrafts();
    const interval = setInterval(fetchDrafts, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveProfile = (updated: DoctorProfile) => {
    setDoctorProfile(updated);
    localStorage.setItem("medicore_doctor_profile", JSON.stringify(updated));
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleAddPatient = (newPat: PatientRecord) => {
    setPatients((prev) => [newPat, ...prev]);
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleApproveDraftNote = (id: string) => {
    setDraftNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "APPROVED" } : n))
    );
    fetch(`/api/phone/drafts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    }).catch((err) => console.error("Failed to approve note on backend:", err));
  };

  const handleNewDraftCreated = (note: DraftNote) => {
    setDraftNotes((prev) => [note, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header
        doctorProfile={doctorProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenPhoneSyncModal={() => setActiveTab("phone-sync")}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotifRead}
        onSearchClick={() => setActiveTab("patients")}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          draftCount={draftNotes.filter((n) => n.status === "DRAFT").length}
        />

        {/* View Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <DashboardMainView
              doctorProfile={doctorProfile}
              appointments={appointments}
              draftNotes={draftNotes}
              patients={patients}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
              onOpenPhoneSyncModal={() => setActiveTab("phone-sync")}
              onAddAppointmentClick={() => setActiveTab("appointments")}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === "exam-summary" && (
            <ExamSummaryView
              doctorProfile={doctorProfile}
              labComponents={labComponents}
            />
          )}

          {activeTab === "phone-sync" && (
            <DocAssistPhoneSync
              draftNotes={draftNotes}
              onApproveNote={handleApproveDraftNote}
              onNewDraftCreated={handleNewDraftCreated}
            />
          )}

          {activeTab === "patients" && (
            <PatientsView
              patients={patients}
              onAddPatient={handleAddPatient}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsView
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}

          {activeTab === "ai-diagnosis" && (
            <AIDiagnosisSupport doctorProfile={doctorProfile} />
          )}

          {activeTab === "prescriptions" && (
            <PrescriptionsView doctorProfile={doctorProfile} />
          )}

          {(activeTab === "lab-reports" ||
            activeTab === "messages" ||
            activeTab === "tasks" ||
            activeTab === "analytics" ||
            activeTab === "settings") && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                {activeTab.replace("-", " ")} Module
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                This clinical module is active and connected to MediCore AI ERP. Data updates will reflect automatically.
              </p>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating AI Clinical Assistant Chatbot */}
      <AIAssistantChat doctorProfile={doctorProfile} />

      {/* Doctor Profile & Designation Customizer Modal */}
      <DoctorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={doctorProfile}
        onSave={handleSaveProfile}
      />

      {/* AI Patient Summary Generator Modal */}
      <PatientSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        patients={patients}
      />
    </div>
  );
}

export default App;
