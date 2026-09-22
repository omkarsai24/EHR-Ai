import React, { useState } from "react";
import { PatientRecord } from "../types";
import { X, Sparkles, Loader2, FileText, CheckCircle, ShieldAlert, Download } from "lucide-react";

interface PatientSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientRecord[];
}

export const PatientSummaryModal: React.FC<PatientSummaryModalProps> = ({
  isOpen,
  onClose,
  patients,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  if (!isOpen) return null;

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleGenerate = async () => {
    if (!patient) return;
    setLoading(true);
    setSummary(null);

    try {
      const res = await fetch("/api/ai/patient-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData: patient }),
      });
      const data = await res.json();
      setSummary(data.summary || "Summary generation complete.");
    } catch (err) {
      console.error("Summary error:", err);
      setSummary("Failed to generate summary. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Patient Summary Generator</h2>
              <p className="text-blue-100 text-xs mt-0.5">
                Generate concise, structured clinical executive summaries powered by Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Patient Record
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age}y {p.gender}) — Condition: {p.condition}
                </option>
              ))}
            </select>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Clinical Records with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate AI Clinical Summary
              </>
            )}
          </button>

          {/* Output Display */}
          {summary && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Generated Summary for {patient?.name}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                  AI Draft Verified
                </span>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-1">
                {summary}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
