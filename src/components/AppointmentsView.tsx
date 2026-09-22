import React, { useState } from "react";
import { Appointment } from "../types";
import { Calendar, Clock, Plus, CheckCircle2, AlertCircle, Search, User, Filter, X } from "lucide-react";

interface AppointmentsViewProps {
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onAddAppointment,
  selectedDate,
  onSelectDate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New appointment form state
  const [patientName, setPatientName] = useState("");
  const [time, setTime] = useState("10:30 AM");
  const [type, setType] = useState<Appointment["type"]>("Consultation");
  const [date, setDate] = useState(selectedDate || "2026-05-20");

  const filtered = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const created: Appointment = {
      id: `apt-${Date.now()}`,
      time,
      patientName,
      patientAge: 40,
      patientGender: "Male",
      type,
      status: "Confirmed",
      date,
    };

    onAddAppointment(created);
    setShowAddModal(false);
    setPatientName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Clinical Appointment Schedule</h2>
          <p className="text-xs text-slate-500">Manage patient bookings, follow-ups & ECG reviews</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Schedule New Appointment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search appointment by patient name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs">
          <span className="text-slate-500 font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {["ALL", "Confirmed", "Pending", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Time & Date</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Consultation Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold text-slate-900">{apt.time}</span>
                      <span className="text-[10px] text-slate-400">({apt.date})</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                        {apt.patientName[0]}
                      </div>
                      <span className="font-bold text-slate-900">{apt.patientName}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-semibold text-[11px]">
                      {apt.type}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        apt.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {apt.status === "Confirmed" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {apt.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline">
                      Start Consultation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Schedule Patient Appointment</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Vikram Singh"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Appointment Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="ECG Review">ECG Review</option>
                  <option value="Lab Review">Lab Review</option>
                </select>
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
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
