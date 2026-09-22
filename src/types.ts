export interface DoctorProfile {
  name: string;
  designation: string;
  department: string;
  hospital: string;
  qualification: string;
  licenseNumber: string;
  photoUrl: string; // Base64 data URL or preset URL
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  type: "Follow-up" | "Consultation" | "ECG Review" | "Lab Review" | "Emergency";
  status: "Confirmed" | "Pending" | "In Consultation" | "Completed" | "No Show";
  date: string; // YYYY-MM-DD
  doctorNotes?: string;
  avatarUrl?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodType: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  vitals: {
    heartPulse: number; // bpm
    bloodPressure: string; // e.g. 116/66
    bloodSugar: number; // mg/dL
    oxygenSat: number; // %
  };
  upcomingVisit?: {
    date: string;
    location: string;
    time: string;
  };
}

export interface DraftNote {
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
}

export interface LabComponent {
  id: string;
  name: string;
  category: "TSH" | "Lipid Panel" | "Comprehensive Metabolic Panel" | "Other";
  normalRange: string;
  currentValue: number;
  unit: string;
  status: "normal" | "warning" | "danger";
  history: Array<{ year: string; value: number }>;
}

export interface EHRNotification {
  id: string;
  title: string;
  time: string;
  type: "lab" | "appointment" | "prescription" | "alert";
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
