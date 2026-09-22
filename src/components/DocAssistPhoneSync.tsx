import React, { useState } from "react";
import { DraftNote } from "../types";
import { Smartphone, QrCode, CheckCircle2, Mic, MicOff, Send, Loader2, Sparkles, FileText, Check, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

interface DocAssistPhoneSyncProps {
  draftNotes: DraftNote[];
  onApproveNote: (id: string) => void;
  onNewDraftCreated: (note: DraftNote) => void;
}

export const DocAssistPhoneSync: React.FC<DocAssistPhoneSyncProps> = ({
  draftNotes,
  onApproveNote,
  onNewDraftCreated,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"phone-simulator" | "incoming-drafts" | "pairing">("phone-simulator");
  const [recording, setRecording] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [processingAi, setProcessingAi] = useState(false);

  // Phone simulator input state
  const [simPatientName, setSimPatientName] = useState("Siddharth Rao");
  const [simAge, setSimAge] = useState("50");
  const [simGender, setSimGender] = useState("Male");
  const [simTranscript, setSimTranscript] = useState(
    "Doctor: Hello Siddharth, what brings you to the clinic today?\nPatient: Doctor, I've had a persistent dry cough for 3 days and a mild fever around 99.8 F. Also feeling fatigued.\nDoctor: Any chest congestion, breathlessness or throat pain?\nPatient: Mild throat pain when swallowing, no breathlessness.\nDoctor: Are you allergic to any medications?\nPatient: Yes, allergic to Amoxicillin.\nDoctor: Okay, I will note down penicillin/beta-lactam allergy."
  );

  const [extractedNote, setExtractedNote] = useState<Partial<DraftNote> | null>(null);

  // Timer simulation
  React.useEffect(() => {
    let interval: any;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleSimulateExtraction = async () => {
    if (!consentGiven) {
      alert("Please confirm patient consent before recording consultation.");
      return;
    }
    setProcessingAi(true);

    try {
      const res = await fetch("/api/ai/extract-soap-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: simTranscript,
          patientName: simPatientName,
          patientAge: simAge,
          patientGender: simGender,
        }),
      });

      const data = await res.json();

      const note: DraftNote = {
        id: `note-${Date.now()}`,
        patientName: simPatientName,
        patientAge: simAge,
        patientGender: simGender,
        chiefComplaint: data.chiefComplaint || "Dry cough and mild fever",
        symptoms: data.symptoms || ["Dry cough", "Mild fever 99.8 F", "Fatigue"],
        history: data.history || ["None reported"],
        allergies: data.allergies || ["Amoxicillin"],
        medications: data.medications || ["None"],
        transcript: simTranscript,
        status: "DRAFT",
        timestamp: new Date().toISOString(),
        sourceDevice: "iQOO 12 Pro (Android 14)",
        aiConfidence: data.aiConfidence || 0.95,
      };

      setExtractedNote(note);

      // Post to backend
      await fetch("/api/phone/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });

      onNewDraftCreated(note);
    } catch (err) {
      console.error("Extraction error:", err);
    } finally {
      setProcessingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-full border border-blue-500/30">
              CROSS-PLATFORM REACT NATIVE LINK
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Paired with iQOO Android Device
            </span>
          </div>
          <h2 className="text-xl font-bold">DocAssist Pocket-EHR Phone Integration</h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Talk into phone → Speech-to-Text AI note extraction → Instant PC dashboard sync → Doctor reviews & approves.
          </p>
        </div>

        {/* Subtab Navigation */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("phone-simulator")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "phone-simulator" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" /> Phone App Simulator
          </button>
          <button
            onClick={() => setActiveSubTab("incoming-drafts")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "incoming-drafts" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" /> PC Incoming Drafts ({draftNotes.length})
          </button>
          <button
            onClick={() => setActiveSubTab("pairing")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "pairing" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" /> Device Pairing
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Phone App Simulator (React Native Android Prototype) */}
      {activeSubTab === "phone-simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Phone Frame Mockup (Left 5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[340px] bg-slate-950 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
              {/* Camera Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
              </div>

              {/* Phone Content Screen */}
              <div className="bg-slate-900 text-white rounded-[28px] p-4 space-y-4 text-xs font-sans min-h-[560px] flex flex-col justify-between border border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-[11px] text-slate-200">DocAssist Pocket-EHR</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    iQOO 12 Pro
                  </span>
                </div>

                {/* Patient Info Fields */}
                <div className="space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={simPatientName}
                      onChange={(e) => setSimPatientName(e.target.value)}
                      placeholder="Patient Name"
                      className="w-full px-2 py-1 text-[11px] bg-slate-900 border border-slate-700 rounded text-white"
                    />
                    <input
                      type="text"
                      value={simAge}
                      onChange={(e) => setSimAge(e.target.value)}
                      placeholder="Age"
                      className="w-full px-2 py-1 text-[11px] bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>

                {/* Patient Consent Checkbox */}
                <div className="flex items-center gap-2 p-2 bg-blue-950/40 rounded-lg border border-blue-800/40">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                  />
                  <label htmlFor="consentCheck" className="text-[10px] text-blue-200 cursor-pointer leading-tight">
                    Patient consented to clinical audio recording.
                  </label>
                </div>

                {/* Speech Recording Control */}
                <div className="text-center py-2 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-2">
                  <button
                    onClick={() => setRecording(!recording)}
                    className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center transition-transform active:scale-95 shadow-lg ${
                      recording ? "bg-rose-600 animate-pulse text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    {recording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <p className="text-[10px] font-bold text-slate-300">
                    {recording ? `Recording Consultation... 00:${String(recordingTime).padStart(2, "0")}` : "Tap Mic to Start Recording"}
                  </p>
                </div>

                {/* Transcript Box */}
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Consultation Transcript</label>
                  <textarea
                    rows={5}
                    value={simTranscript}
                    onChange={(e) => setSimTranscript(e.target.value)}
                    className="w-full p-2 text-[10px] bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono resize-none"
                  />
                </div>

                {/* Extract & Sync Action */}
                <button
                  onClick={handleSimulateExtraction}
                  disabled={processingAi}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {processingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Extracting AI Note...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Transfer Note to PC Dashboard
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Extraction Preview & Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Live AI Note Extraction Preview</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
                  SOAP Format
                </span>
              </div>

              {extractedNote ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-bold text-slate-900">{extractedNote.patientName} ({extractedNote.patientAge}y {extractedNote.patientGender})</h4>
                      <p className="text-[10px] text-slate-500">Source: {extractedNote.sourceDevice}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Transferred to PC
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Chief Complaint:</span>
                    <p className="text-slate-800 bg-white p-2 rounded border border-slate-200">{extractedNote.chiefComplaint}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Reported Symptoms:</span>
                      <ul className="list-disc list-inside text-slate-700 bg-white p-2 rounded border border-slate-200 space-y-0.5">
                        {extractedNote.symptoms?.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Allergies:</span>
                      <ul className="list-disc list-inside text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 font-semibold space-y-0.5">
                        {extractedNote.allergies?.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                  <Smartphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No note synced yet in this session.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tap <span className="font-bold text-blue-600">"Transfer Note to PC Dashboard"</span> on the phone app simulator on the left to test instant sync.
                  </p>
                </div>
              )}
            </div>

            {/* Architecture Overview Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 space-y-2 text-xs">
              <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Security & Workflow Guarantee
              </h4>
              <p className="text-slate-700 leading-relaxed">
                1. Patient consent is confirmed prior to consultation capture.<br />
                2. On-device / edge speech-to-text turns spoken consultation into transcript.<br />
                3. Gemini AI structures the note into SOAP fields without diagnosing autonomously.<br />
                4. The doctor on the PC dashboard maintains absolute authority to edit, verify, or discard any note.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PC Dashboard Incoming Draft Notes */}
      {activeSubTab === "incoming-drafts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Incoming Mobile Draft Notes for Review ({draftNotes.length})
            </h3>
            <span className="text-xs text-slate-500">
              Double-check AI draft note before saving to EHR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftNotes.map((note) => (
              <div
                key={note.id}
                className={`bg-white p-5 rounded-2xl border transition-all ${
                  note.status === "APPROVED"
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200 hover:border-blue-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {note.patientName} ({note.patientAge}y {note.patientGender})
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      From: {note.sourceDevice} • {new Date(note.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      note.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {note.status === "APPROVED" ? "APPROVED & SAVED" : "DRAFT - NEEDS REVIEW"}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 mb-4">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Chief Complaint:</span>
                    <p className="bg-slate-50 p-2 rounded border border-slate-200">{note.chiefComplaint}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Symptoms:</span>
                      <p className="bg-slate-50 p-2 rounded border border-slate-200">{note.symptoms.join(", ")}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Allergies:</span>
                      <p className="bg-rose-50 text-rose-800 font-semibold p-2 rounded border border-rose-200">
                        {note.allergies.join(", ") || "None"}
                      </p>
                    </div>
                  </div>
                </div>

                {note.status !== "APPROVED" && (
                  <button
                    onClick={() => onApproveNote(note.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve & Save to Medical Records
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Device Pairing */}
      {activeSubTab === "pairing" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 max-w-xl mx-auto text-center space-y-4">
          <QrCode className="w-12 h-12 text-blue-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Pair Doctor's Smartphone</h3>
          <p className="text-xs text-slate-500">
            Scan this QR code using the DocAssist Android App on your iQOO phone to securely link with this PC web dashboard.
          </p>

          <div className="w-48 h-48 bg-slate-900 p-3 rounded-2xl mx-auto flex items-center justify-center border-4 border-blue-100 shadow-md">
            <div className="text-white text-[10px] font-mono grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-950 rounded-xl">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className={`rounded ${i % 2 === 0 ? "bg-blue-400" : "bg-slate-800"}`} />
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500">Pairing Code:</span> <strong className="text-blue-700 font-mono text-sm ml-2">482-910</strong>
          </div>
        </div>
      )}
    </div>
  );
};
