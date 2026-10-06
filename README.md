# CARE-PASS AI
### AI-Powered Multilingual Patient Information & Care-Navigation Platform

> **TAGLINE:** “Turn health concerns into clear, organized information — in seconds.”

---

> [!IMPORTANT]
> **STUDENT HACKATHON PROTOTYPE NOTICE:**
> CARE-PASS AI is an educational student hackathon prototype, **NOT a medical diagnosis system**. The platform never claims to diagnose diseases, prescribe medicines, replace doctors, or guarantee clinical outcomes. All AI-generated outputs are strictly informational and intended to help patients communicate organized health history to certified healthcare professionals.

---

## 1. Project Overview & Problem Statement

### The Problem
Healthcare information is often scattered, emotionally difficult to articulate, language-dependent, and poorly organized. In clinical environments:
- Patients struggle to communicate what symptoms they have, exact onset dates, and severity.
- Vital information like over-the-counter tablets or previous conditions is routinely forgotten during rushed appointments.
- Multilingual patients (e.g. native Tamil speakers) struggle to find equivalent English medical terms.
- Patients feel anxious and unprepared for clinical discussions with physicians.

### The Solution
**CARE-PASS AI** converts a user's natural-language health concern into an organized, doctor-ready patient consultation report in seconds. It bridges the communication gap by structuring fragmented narratives into a standardized format with non-diagnostic urgency indicators and smart questions.

```
USER INPUT (English / Tamil)
       ↓
AI INFORMATION EXTRACTION (Zero-Hallucination)
       ↓
SYMPTOM / CONCERN SUMMARY
       ↓
URGENCY INDICATION (Routine 🟢 / Attention 🟠 / Urgent 🔴)
       ↓
CARE-NAVIGATION & SMART QUESTIONS
       ↓
DOCTOR-READY SUMMARY & CARE-PASS SCORE
       ↓
ONE-CLICK PDF / PRINT / COPY
```

---

## 2. Key Innovations

1. **Native Multilingual Intake (Tamil & English):**
   - Natural language input in Tamil (`“எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு.”`) or English.
   - Extracts accurate clinical variables without altering meaning or hallucinating data.
2. **Signature “Care-Pass Score” (Information Completeness):**
   - Progress bar (0–100%) and interactive breakdown evaluating whether the patient provided primary concern, duration, symptoms, medications, severity, and context.
   - *Prominently labeled: “This score measures information completeness, not health status.”*
3. **Doctor-Ready Clinical Summary:**
   - Standardized format matching physician intake workflows: Primary Concern, Symptoms Mentioned, Duration, Severity, Medications Mentioned, Relevant Clinical Info, Follow-up Questions, and Missing Information.
   - One-click styled PDF download (`jsPDF`) and print stylesheet.
4. **Three-Tier Informational Urgency Indicator:**
   - 🟢 **ROUTINE:** Non-urgent concerns suitable for standard consultations.
   - 🟠 **NEEDS ATTENTION:** Persistent symptoms or elevated discomfort warranting timely medical evaluation.
   - 🔴 **URGENT:** Critical red-flags (e.g. crushing chest pain, acute breathing difficulty) that trigger the Emergency Safety Card and local emergency calling.
5. **Role-Based Workspaces:**
   - **Patient Workspace:** Concern analysis, health timeline, emergency contacts, privacy center.
   - **Healthcare Professional Portal:** Patient intake queue, demo patient review, triage filtering.
   - **Admin Console:** Telemetry, language usage charts (`Recharts`), user management, real-time audit logs.
6. **Self-Sovereign Privacy Center:**
   - One-click machine-readable JSON data export (`Download My Data`).
   - Permanent data purge (`Delete My Data`).

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite 6
- **Styling & UI:** Tailwind CSS, Glassmorphism, Custom Glow System
- **3D Visualization:** HTML5 Canvas Interactive 3D Sphere & Neural Network with mouse parallax and `prefers-reduced-motion` compliance
- **Icons & Visuals:** Lucide React
- **Animations & Effects:** Framer Motion, Canvas Confetti
- **Document Export:** jsPDF, HTML2Canvas, Print Media Queries
- **Charts & Telemetry:** Recharts (Bar Charts, Donut Distribution)
- **Backend API:** Node.js, Express, CORS
- **AI & NLP Engine:**
  - Cloud LLM connector (Google Gemini 1.5 Flash / OpenAI compatible)
  - Resilient built-in multilingual deterministic extractor with deep Tamil and English lexicons
- **Database & Auth:**
  - Supabase PostgreSQL with Row Level Security (RLS) migrations included
  - Resilient local database layer for instant zero-dependency hackathon testing

---

## 4. Database Schema (Supabase PostgreSQL)

Located at `supabase/migrations/001_initial_schema.sql`:

- `profiles` — User profile, roles (`PATIENT`, `HEALTHCARE_PROFESSIONAL`, `ADMIN`), language, emergency number.
- `health_entries` — Raw user input text, language, source, timestamp.
- `health_summaries` — Structured symptoms, duration, severity, medications, missing information, priority, completeness score.
- `appointments` — Provider name, specialty, appointment date, consultation notes, status.
- `emergency_contacts` — Personal contacts, relationships, phone numbers, primary flags.
- `audit_logs` — Action, resource type, metadata, timestamps.

Row Level Security (RLS) policies enforce that patients only access their own records, while healthcare professionals access authorized demo handoffs.

---

## 5. Security & Ethical AI Guardrails

- **Zero-Hallucination Guardrail:** The AI extracts *only* information explicitly provided. If unknown, it outputs `"Not provided"` rather than guessing.
- **Strict Non-Diagnostic Boundary:** No medical diagnosis, no drug prescribing, and no disease labeling.
- **Emergency Escalation:** Triggers a prominent safety protocol with clickable local emergency calling (`108 / 911 / 112`) if acute danger signs are detected.
- **Secure Password Hashing:** Salted SHA-256 password hashing. Passwords are never returned in API payloads.
- **Environment Isolation:** Zero credentials exposed to client-side bundles.

---

## 6. Installation & Running Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Quick Start (Single Command)

```bash
# 1. Install all dependencies (if not already installed)
npm install

# 2. Run backend and frontend concurrently
npm run dev
```

The application will start:
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 7. Environment Variables (`.env.example`)

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

# Optional AI API Key (Gemini or OpenAI).
# If omitted, CARE-PASS AI uses its built-in multilingual extraction engine!
GEMINI_API_KEY=
OPENAI_API_KEY=

# Optional Supabase Database & Auth (for production cloud database)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Regional Emergency Dispatch (e.g., 108 for India, 911 for USA, 112 for EU, 999 for UK)
VITE_DEFAULT_EMERGENCY_NUMBER=108
EMERGENCY_NUMBER=108
```

---

## 8. Demo Accounts (Hackathon Credentials)

For rapid evaluation, use the **1-Click Quick Demo Sign-In** on `/login` or the **“🚀 ENTER HACKATHON DEMO”** button in the navigation bar:

| Role | Email | Password | Persona & Capabilities |
|---|---|---|---|
| **Patient** | `demo.patient@example.com` | `Demo123!` | Ananya Sharma — AI Intake, Health Timeline, Care-Pass Score, PDF Export |
| **Doctor** | `demo.doctor@example.com` | `Demo123!` | Dr. Rajesh Varma, MD — Clinical Intake Queue, Patient Review, Triage |
| **Admin** | `demo.admin@example.com` | `Demo123!` | Karthik Admin — Telemetry Charts, System Status, User Management, Audit Logs |

---

## 9. 2-Minute Hackathon Presentation Flow

1. **Step 1: Landing Page (0:00 – 0:30)**
   - Open [http://localhost:5173](http://localhost:5173).
   - Point out the 3D interactive medical sphere, floating badge cards, and core problem tagline: *“Turn health concerns into clear, organized information — in seconds.”*
2. **Step 2: Enter Demo Mode (0:30 – 1:00)**
   - Click **“🚀 ENTER HACKATHON DEMO”** in the navbar.
   - Click **Scenario 1 (Fever & Fatigue)** or switch language to **தமிழ் (Tamil)** to see native Tamil intake:
     *“எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு.”*
   - Click **“Analyze with AI”**.
3. **Step 3: Review Structured Output (1:00 – 1:30)**
   - Highlight the **Care-Pass Score (Information Completeness)** with checklist items.
   - Point out the **Informational Priority** badge and the **Zero-Hallucination Summary**.
   - Show **Smart Questions to Discuss** and click **“Download PDF”** or **“Copy Summary”**.
   - Click **“Save Summary”** (with confetti celebration).
4. **Step 4: Health Timeline & Doctor Handoff (1:30 – 1:45)**
   - Navigate to **Timeline** (`/history`) to see the longitudinal view (Sept 20, Sept 27, Oct 5).
5. **Step 5: Doctor & Admin Portals (1:45 – 2:00)**
   - Click navbar demo switcher -> **Doctor User** to review the clinical handoff queue.
   - Click navbar demo switcher -> **Administrator** to see live language usage charts, system latency, and audit logs.

---

## 10. Implemented Features Checklist

- [x] Full-stack web application with React 18, TypeScript, Tailwind CSS & Node.js Express.
- [x] Multilingual natural-language health input (English & Tamil).
- [x] Zero-hallucination AI extractor that indicates "Not provided" when details are missing.
- [x] Three informational priority levels: Routine 🟢, Needs Attention 🟠, Urgent 🔴.
- [x] Doctor-Ready Summary with Copy, Download PDF (`jsPDF`), and Print layout.
- [x] Smart Follow-Up Questions for clinical visits.
- [x] Configurable Emergency Safety Card with instant click-to-call link.
- [x] Visual Health History Timeline with deletion support and demo labels.
- [x] Care Navigation and appointment preparation guidance.
- [x] Signature **Care-Pass Score** (Information Completeness metric).
- [x] AI Transparency card (What AI Does vs Does Not Do).
- [x] Self-sovereign Privacy Center (JSON Export & Irreversible Purge).
- [x] Role-based dashboards for Patient, Doctor, and Administrator.
- [x] Interactive 3D Canvas medical visualization with mouse parallax.
- [x] Three preloaded Hackathon Demo scenarios (Fever, Doctor Prep, Emergency Alert).
- [x] Supabase PostgreSQL migration schema with Row Level Security (RLS) policies.
- [x] Resilient local fallback engine ensuring 100% uptime with zero external dependencies.

---

## 11. Known Limitations & Future Roadmap

### Current Limitations
- **Informational Only:** The system does not review medical laboratory tests or diagnostic imaging (e.g. X-rays, MRI scans).
- **Language Scope:** Currently optimized for English and Tamil; further regional languages are in development.
- **Offline LLM:** Cloud LLM calls require an active internet connection and API key; otherwise, the built-in deterministic engine is utilized.

### Future Improvements
1. **Speech-to-Text Audio Intake:** Voice recording in native dialects for elderly patients.
2. **Additional Regional Languages:** Hindi, Telugu, Kannada, Malayalam, Bengali, and Spanish.
3. **FHIR / HL7 Interoperability:** Exporting summaries directly into hospital Electronic Health Record (EHR) systems.
4. **Wearable Device Integration:** Automatic ingestion of resting heart rate and oxygen saturation (SpO2) data.

---

*CARE-PASS AI — Built with passion as a student innovation prototype for global hackathon demonstration.*
