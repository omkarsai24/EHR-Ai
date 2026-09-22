# DocAssist AI - EHR AI Platform

> **Clinical Documentation & EHR Dashboard with Phone-to-PC Sync**

## Overview

Our team focuses on solving a real-world problem in small clinics: the time and effort doctors spend on clinical documentation. **DocAssist AI** combines an Android-based consultation workflow with AI-assisted structured note generation and a doctor review dashboard.

What makes our approach different is our focus on **privacy-conscious processing**, **potential on-device AI**, and **keeping doctors in control** of reviewing and approving clinical information before committing to records.

We are building this project from the ground up with a practical MVP approach, aiming to create a useful solution while continuously learning and validating our technology. Our goal is to turn an innovative idea into a working prototype that can make clinical documentation simpler and more efficient.

---

## Key Features

- 📱 **Mobile-to-PC Sync**: Live wireless pairing simulation connecting mobile consultation capture directly with the desktop EHR.
- 🩺 **Doctor Review & Control**: Clinical draft review pipeline ensuring medical professionals verify and approve generated notes, symptoms, and histories.
- ⚡ **Real-Time Clinical AI Assistant**: Embedded AI Assistant capable of differential diagnosis assistance, medication interaction analysis, and consultation queries.
- 📊 **Smart Clinical Dashboard**: Patient demographics, appointments scheduling, lab reports tracking, and vitals trend monitoring.
- 🔒 **Privacy-Conscious Architecture**: Designed for local data control, structured extraction, and clinical privacy compliance.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation

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
   Create a `.env` file from `.env.example`:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion
- **Backend / Integration**: Node.js, Express, Google GenAI SDK
- **Language**: TypeScript

---

## License
MIT License. Created by [omkarsai24](https://github.com/omkarsai24).
