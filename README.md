# DocAssist AI - Clinical EHR AI Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://ehr-ai-omkarsai.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **AI-Powered Clinical Documentation & EHR Dashboard with Mobile-to-PC Sync**

---

## 🌐 Live Web Preview & Demo

Experience the full interactive MediCore EHR dashboard directly in your browser:

### 🔗 **[https://ehr-ai-omkarsai.vercel.app](https://ehr-ai-omkarsai.vercel.app)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fomkarsai24%2FEHR-Ai)

---

## 💡 About The Project

Our team focuses on solving a real-world problem in small clinics: **the excessive time and cognitive effort doctors spend on clinical documentation**. 

**DocAssist AI** combines an Android-based consultation workflow with AI-assisted structured note generation and a doctor review dashboard. What makes our approach distinct:

1. **Doctor in the Loop**: AI drafts clinical SOAP notes, extracted findings, and risk flags, but the licensed practitioner maintains 100% review and approval control before records are committed.
2. **Privacy-Conscious Architecture**: Designed for local data control, structured extraction, and clinical privacy compliance.
3. **Seamless Mobile-to-PC Sync**: Doctors can dictate or record consultations on mobile, with draft notes appearing instantaneously on their desktop workstation.
4. **Practical MVP Approach**: Built from the ground up to turn clinical documentation challenges into an intuitive, reliable daily tool for clinics.

---

## ✨ Key Features & Capabilities

- 📱 **Mobile-to-PC Sync Simulator**: Pair simulated doctor mobile devices (e.g. *iQOO 12 Pro*) to sync consultation audio transcripts and draft SOAP notes in real time.
- 🩺 **Doctor Review & Verification**: One-click review pipeline allowing doctors to approve, edit symptoms, modify chief complaints, or reject AI notes.
- ⚡ **Embedded Gemini AI Assistant**: Context-aware clinical chatbot assisting with differential diagnoses, medication interactions, and treatment guidelines.
- 📋 **AI Patient Summary Generator**: One-click executive clinical summary generator condensing history, labs, and vitals into structured insights.
- 🗓️ **Smart Scheduling & Appointments**: Full patient queue management with confirmed/pending status filtering and time slot assignments.
- 🧪 **Interactive Exam & Lab Trends**: Longitudinal lab tracking (HbA1c, Lipid profile, Renal panel, CMP) with interactive trend charts.
- 👤 **Customizable Doctor Profile**: Personalize doctor name, designation, department, hospital, and credentials directly in the interface.

---

## 🚀 One-Click Deploy to Vercel

You can deploy your own instance of this EHR platform directly to Vercel with zero configuration:

1. Click the button below:
   
   [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fomkarsai24%2FEHR-Ai)

2. Connect your GitHub account and import `omkarsai24/EHR-Ai`.
3. *(Optional)* Add your `GEMINI_API_KEY` under Environment Variables.
4. Click **Deploy**! Vercel will build and assign your live preview domain.

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or bun

### Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omkarsai24/EHR-Ai.git
   cd EHR-Ai
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment:**
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   APP_URL="https://ehr-ai-omkarsai.vercel.app"
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

5. **Open Dashboard:**
   Visit `http://localhost:3000` in your web browser.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons, Framer Motion |
| **Data Visualization** | Recharts (Longitudinal lab trends & biometric charts) |
| **Deployment & Hosting** | Vercel Edge Network |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Backend Integration** | Express.js, TypeScript |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).  
Created with care by [omkarsai24](https://github.com/omkarsai24).
