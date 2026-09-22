import React, { useState } from "react";
import { PatientRecord } from "../types";
import { Search, Plus, User, Heart, Activity, Flame, Droplets, Phone, Mail, ChevronRight, FileText, X } from "lucide-react";

interface PatientsViewProps {
  patients: PatientRecord[];
  onAddPatient: (patient: PatientRecord) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({ patients, onAddPatient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(patients[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New patient state
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "35",
    gender: "Male" as const,
    bloodType: "O+",
    phone: "",
    email: "",
    condition: "",
  });

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: newPatient.name,
      age: parseInt(newPatient.age) || 30,
      gender: newPatient.gender,
      bloodType: newPatient.bloodType,
      phone: newPatient.phone || "+91 98000 00000",
      email: newPatient.email || "patient@example.com",
      lastVisit: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      condition: newPatient.condition || "General Consultation",
      vitals: {
        heartPulse: 72,
        bloodPressure: "120/80",
        bloodSugar: 90,
        oxygenSat: 98,
      },
    };
    onAddPatient(created);
    setSelectedPatient(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Patient Directory & Medical Records</h2>
          <p className="text-xs text-slate-500">Manage patient histories, vitals, and EHR files</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Patient
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or condition..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedPatient?.id === p.id
                    ? "bg-blue-50/80 border-blue-400 shadow-sm"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                    <p className="text-[10px] text-slate-500">{p.age}y {p.gender} • Blood Group: {p.bloodType}</p>
                    <p className="text-[11px] font-semibold text-blue-700 mt-0.5">{p.condition}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Patient Chart (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPatient ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                    {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-500">
                      ID: #{selectedPatient.id} • {selectedPatient.age} Yrs ({selectedPatient.gender})
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200">
                  {selectedPatient.bloodType}
                </span>
              </div>

              {/* Vitals Summary */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  Current Vitals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> Heart Rate
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1">{selectedPatient.vitals.heartPulse} <span className="text-[10px] font-medium text-slate-500">bpm</span></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-blue-500" /> Blood Pressure
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1">{selectedPatient.vitals.bloodPressure}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> Blood Sugar
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1">{selectedPatient.vitals.bloodSugar} <span className="text-[10px] font-medium text-slate-500">mg/dL</span></p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-emerald-500" /> Oxygen
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1">{selectedPatient.vitals.oxygenSat}%</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Contact Details</h4>
                <div className="flex items-center gap-4 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-600" /> {selectedPatient.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-600" /> {selectedPatient.email}</span>
                </div>
              </div>

              {/* Clinical Condition */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Diagnosed Conditions & Complaints</h4>
                <p className="p-3 bg-blue-50/50 text-blue-900 font-medium rounded-xl border border-blue-200">
                  {selectedPatient.condition}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">
              Select a patient from the left list to view their medical chart.
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Patient Record</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="e.g. Ananya Roy"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Primary Condition / Symptoms</label>
                <input
                  type="text"
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                  placeholder="e.g. Hypertension, Palpitations"
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
                  Create Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
