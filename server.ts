import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// In-memory data store for live mobile-to-PC sync simulation
let phonePairings: Record<string, { deviceName: string; pairedAt: string; code: string; status: "connected" | "disconnected" }> = {
  "iqoo-12-pro": {
    deviceName: "iQOO 12 Pro (Android 14)",
    pairedAt: new Date().toISOString(),
    code: "482910",
    status: "connected",
  },
};

let syncedDraftNotes: Array<{
  id: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  chiefComplaint: string;
  symptoms: string[];
  history: string[];
  allergies: string[];
  medications: string[];
  transcript: string;
  status: "DRAFT" | "REVIEWED" | "APPROVED";
  timestamp: string;
  sourceDevice: string;
  aiConfidence: number;
}> = [
  {
    id: "note-101",
    patientName: "Arjun Sharma",
    patientAge: "45",
    patientGender: "Male",
    chiefComplaint: "Acute retrosternal chest discomfort radiating to left arm on exertion.",
    symptoms: ["Chest tightness", "Mild shortness of breath", "Diaphoresis during stairs climb"],
    history: ["Hypertension (5 yrs)", "Hyperlipidemia"],
    allergies: ["Penicillin"],
    medications: ["Amlodipine 5mg", "Atorvastatin 20mg"],
    transcript: "Doctor: Good morning Arjun, what brings you in today?\nPatient: I felt a tight pressure in my chest while walking up the stairs this morning. It lasted about 10 minutes.\nDoctor: Did it spread anywhere?\nPatient: Yes, down my left arm a bit, and I broke out into a sweat.\nDoctor: Any shortness of breath or dizziness?\nPatient: A little short of breath. I take my BP meds regularly.",
    status: "DRAFT",
    timestamp: "2026-05-20T09:20:00Z",
    sourceDevice: "iQOO 12 Pro (Android)",
    aiConfidence: 0.94,
  },
  {
    id: "note-102",
    patientName: "Neha Kapoor",
    patientAge: "38",
    patientGender: "Female",
    chiefComplaint: "Recurrent palpitations and episodic anxiety over the past 2 weeks.",
    symptoms: ["Racing heart", "Fatigue", "Lightheadedness"],
    history: ["Mild Asthma"],
    allergies: ["Sulfa drugs"],
    medications: ["Salbutamol inhaler PRN"],
    transcript: "Doctor: Hello Neha, tell me about these palpitations.\nPatient: My heart starts racing suddenly, even when sitting at my desk. It feels like 120 beats per minute.\nDoctor: Any chest pain or syncopal episodes?\nPatient: No faintness, just lightheadedness and feeling exhausted afterwards.",
    status: "DRAFT",
    timestamp: "2026-05-20T10:10:00Z",
    sourceDevice: "iQOO 12 Pro (Android)",
    aiConfidence: 0.91,
  },
];

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chatbot Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, doctorInfo } = req.body;
    const ai = getGenAI();

    const systemInstruction = `You are MediCore AI Clinical Assistant, an advanced medical AI embedded in the MediCore EHR system, assisting ${doctorInfo?.name || "Dr. Rohan Mehta"}, ${doctorInfo?.designation || "Cardiologist"} at ${doctorInfo?.department || "Cardiology Department"}, ${doctorInfo?.hospital || "CityCare Hospital"}.

Your capabilities:
1. Provide evidence-based clinical reasoning, differential diagnoses, and treatment guidelines.
2. Summarize clinical transcripts and patient records into SOAP format.
3. Check drug interactions, contraindications, and dosage guidelines.
4. Maintain a professional, concise, empathetic, and clinical tone.
5. ALWAYS remind the doctor that AI outputs are draft recommendations requiring licensed medical verification.

Format output with clean markdown bullet points, clear headings, and precise medical terms.`;

    // Convert messages for Gemini
    const lastUserMsg = messages[messages.length - 1]?.text || "Hello";
    
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: lastUserMsg,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Error in /api/ai/chat:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI response." });
  }
});

// AI Patient Summary Generator Endpoint
app.post("/api/ai/patient-summary", async (req, res) => {
  try {
    const { patientData } = req.body;
    const ai = getGenAI();

    const prompt = `Generate a concise 1-page clinical summary for the following patient record:
Patient Name: ${patientData.name || "Unknown"}
Age/Gender: ${patientData.age || "N/A"} / ${patientData.gender || "N/A"}
Vitals: ${JSON.stringify(patientData.vitals || {})}
Recent Labs: ${JSON.stringify(patientData.labs || {})}
Medical History: ${patientData.history || "None"}
Current Medications: ${patientData.medications || "None"}

Please structure the summary into:
1. Executive Clinical Summary (Key findings & current status)
2. Risk Factors & Red Flags
3. Recommended Follow-ups & Next Diagnostic Steps
4. Medication Review`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    res.json({ summary: response.text });
  } catch (err: any) {
    console.error("Error in /api/ai/patient-summary:", err);
    res.status(500).json({ error: err.message || "Failed to generate patient summary." });
  }
});

// AI Voice Consultation Note Extractor (SOAP format)
app.post("/api/ai/extract-soap-note", async (req, res) => {
  try {
    const { transcript, patientName, patientAge, patientGender } = req.body;
    const ai = getGenAI();

    const prompt = `You are DocAssist AI Clinical Documentation Engine. Analyze the following doctor-patient consultation transcript and extract a structured clinical SOAP note.

Transcript:
"${transcript}"

Patient: ${patientName || "Patient"}, Age: ${patientAge || "N/A"}, Gender: ${patientGender || "N/A"}

Output JSON only in this exact format:
{
  "chiefComplaint": "string",
  "symptoms": ["string"],
  "history": ["string"],
  "allergies": ["string"],
  "medications": ["string"],
  "clinicalFindings": ["string"],
  "assessment": "string",
  "plan": ["string"],
  "aiConfidence": 0.95
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/ai/extract-soap-note:", err);
    res.status(500).json({ error: err.message || "Failed to extract SOAP note." });
  }
});

// Mobile App Sync Endpoints (Phone to PC)
app.get("/api/phone/drafts", (_req, res) => {
  res.json(syncedDraftNotes);
});

app.post("/api/phone/drafts", (req, res) => {
  const newNote = {
    id: `note-${Date.now()}`,
    patientName: req.body.patientName || "New Patient",
    patientAge: req.body.patientAge || "30",
    patientGender: req.body.patientGender || "Male",
    chiefComplaint: req.body.chiefComplaint || "Consultation draft",
    symptoms: req.body.symptoms || [],
    history: req.body.history || [],
    allergies: req.body.allergies || [],
    medications: req.body.medications || [],
    transcript: req.body.transcript || "",
    status: "DRAFT" as const,
    timestamp: new Date().toISOString(),
    sourceDevice: req.body.sourceDevice || "iQOO Phone (DocAssist Mobile)",
    aiConfidence: req.body.aiConfidence || 0.92,
  };
  syncedDraftNotes.unshift(newNote);
  res.json({ success: true, note: newNote });
});

app.patch("/api/phone/drafts/:id", (req, res) => {
  const { id } = req.params;
  const { status, chiefComplaint, symptoms } = req.body;
  const note = syncedDraftNotes.find((n) => n.id === id);
  if (note) {
    if (status) note.status = status;
    if (chiefComplaint) note.chiefComplaint = chiefComplaint;
    if (symptoms) note.symptoms = symptoms;
    res.json({ success: true, note });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

app.get("/api/phone/status", (_req, res) => {
  res.json({
    pairedDevice: phonePairings["iqoo-12-pro"],
    draftsCount: syncedDraftNotes.length,
  });
});

// Vite & Static file handler
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediCore AI EHR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
