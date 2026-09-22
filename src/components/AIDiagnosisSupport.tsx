import React, { useState } from "react";
import { DoctorProfile } from "../types";
import { Brain, Sparkles, Send, Loader2, ShieldAlert, CheckCircle2, Stethoscope, AlertTriangle } from "lucide-react";

interface AIDiagnosisSupportProps {
  doctorProfile: DoctorProfile;
}

export const AIDiagnosisSupport: React.FC<AIDiagnosisSupportProps> = ({ doctorProfile }) => {
  const [symptoms, setSymptoms] = useState("Retrosternal chest tightness, diaphoresis, left arm pain on stair climbing.");
  const [patientContext, setPatientContext] = useState("45yo Male with 5-year history of hypertension and hyperlipidemia.");
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setDiagnosisResult(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              sender: "user",
              text: `Provide a differential diagnosis and recommended diagnostic workup for the following clinical case:\nPatient Context: ${patientContext}\nSymptoms: ${symptoms}`,
            },
          ],
          doctorInfo: doctorProfile,
        }),
      });

      const data = await res.json();
      setDiagnosisResult(data.text || "No output returned.");
    } catch (err) {
      console.error(err);
      setDiagnosisResult("Error analyzing case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-200 text-[10px] font-bold rounded-full border border-indigo-500/30">
              GEMINI 3.8 FLASH CLINICAL DECISION ENGINE
            </span>
          </div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" /> AI Differential Diagnosis Support
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1">
            Input clinical presentation, vitals, and history to receive evidence-based differential diagnosis suggestions and recommended test protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical Input (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-blue-600" /> Clinical Case Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Patient History & Vitals</label>
            <textarea
              rows={3}
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
              placeholder="Age, Gender, Comorbidities, Medications..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Presenting Symptoms & Exam Findings</label>
            <textarea
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe chief complaint, onset, radiation, severity..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Differential Diagnosis...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Generate Differential Diagnosis
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output Workbench (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Differential Reasoning Workbench
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Doctor Discretion Required</span>
          </div>

          {diagnosisResult ? (
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs leading-relaxed whitespace-pre-wrap text-slate-800 space-y-2 max-h-[460px] overflow-y-auto">
              {diagnosisResult}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              <Brain className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">Ready to analyze clinical presentation.</p>
              <p className="text-[11px] text-slate-400 mt-1">Click "Generate Differential Diagnosis" to run AI reasoning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
