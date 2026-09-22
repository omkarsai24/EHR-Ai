import React, { useState } from "react";
import { DoctorProfile } from "../types";
import { Pill, Plus, Search, Printer, CheckCircle2, AlertTriangle, FileText, X } from "lucide-react";

interface PrescriptionsViewProps {
  doctorProfile: DoctorProfile;
}

interface PrescriptionItem {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: "Active" | "Completed" | "Discontinued";
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({ doctorProfile }) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: "rx-101",
      patientName: "Arjun Sharma",
      medication: "Amlodipine Besylate",
      dosage: "5 mg",
      frequency: "Once daily in morning",
      duration: "30 days",
      date: "20 May 2026",
      status: "Active",
    },
    {
      id: "rx-102",
      patientName: "Arjun Sharma",
      medication: "Atorvastatin Calcium",
      dosage: "20 mg",
      frequency: "Once daily at bedtime",
      duration: "30 days",
      date: "20 May 2026",
      status: "Active",
    },
    {
      id: "rx-103",
      patientName: "Neha Kapoor",
      medication: "Salbutamol Inhaler",
      dosage: "100 mcg",
      frequency: "2 puffs PRN for breathlessness",
      duration: "As needed",
      date: "18 May 2026",
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRx, setNewRx] = useState({
    patientName: "Arjun Sharma",
    medication: "Metoprolol Succinate",
    dosage: "25 mg",
    frequency: "Once daily",
    duration: "14 days",
  });

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      patientName: newRx.patientName,
      medication: newRx.medication,
      dosage: newRx.dosage,
      frequency: newRx.frequency,
      duration: newRx.duration,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Active",
    };
    setPrescriptions([created, ...prescriptions]);
    setShowAddModal(false);
  };

  const filtered = prescriptions.filter((rx) =>
    rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">E-Prescription Management</h2>
          <p className="text-xs text-slate-500">Issued by {doctorProfile.name} ({doctorProfile.designation})</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue New Prescription
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search prescriptions by patient or medication..."
          className="w-full text-xs bg-transparent outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rx) => (
          <div key={rx.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-900">{rx.patientName}</span>
              <span className="text-[10px] text-slate-400">{rx.date}</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-blue-700 flex items-center gap-1.5">
                <Pill className="w-4 h-4" /> {rx.medication}
              </h4>
              <p className="text-xs text-slate-700 font-semibold">Dosage: {rx.dosage}</p>
              <p className="text-[11px] text-slate-500">Frequency: {rx.frequency}</p>
              <p className="text-[11px] text-slate-500">Duration: {rx.duration}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                {rx.status}
              </span>
              <button
                onClick={() => window.print()}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print Rx
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Issue E-Prescription</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateRx} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={newRx.patientName}
                  onChange={(e) => setNewRx({ ...newRx, patientName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Medication Name & Salt</label>
                <input
                  type="text"
                  required
                  value={newRx.medication}
                  onChange={(e) => setNewRx({ ...newRx, medication: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newRx.dosage}
                    onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={newRx.duration}
                    onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Frequency & Instructions</label>
                <input
                  type="text"
                  value={newRx.frequency}
                  onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Sign & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
