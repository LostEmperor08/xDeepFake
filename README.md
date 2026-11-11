# DEEPFAKE X

> **Multimodal Synthetic Media Forensics and Authenticity Verification Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12+-3776AB.svg?logo=python)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

---

## 1. Project Objective & Problem Statement

### The Problem
Generative AI, diffusion models, and neural audio synthesis have dramatically lowered the barrier to producing convincing synthetic media (deepfakes). Contemporary detection tools frequently fail in high-stakes environments because they function as opaque "black boxes" that output uncalibrated probability scores (e.g., claiming "98% deepfake" on an out-of-distribution compressed selfie) with zero verifiable forensic rationale.

### The Solution
**DEEPFAKE X** is an open-architecture multimodal media authenticity verification platform. It analyzes images, video, audio recordings, and PDF documents to identify suspicious manipulation indicators, correlate evidence across physical and frequency domains, and compile an **explainable forensic report**.

Key architectural guarantees:
- **Decoupled Confidence Scoring**: Neural detector outputs are kept separate from holistic risk scoring. Uncalibrated model scores are never disguised as statistical probabilities.
- **Explainable Evidence**: Every finding references empirical evidence layers (container headers, spatial frequency residuals, acoustic footprints) with human-readable rationales.
- **Defensive Sandbox Ingestion**: Magic-byte verification rejects extension spoofing; transient isolated storage prevents path traversal and leaks.

---

## 2. System Architecture

```
                                +-----------------------------------+
                                |    DEEPFAKE X React Web Client    |
                                | (Vite, TypeScript, Tailwind CSS)  |
                                +-----------------+-----------------+
                                                  |
                                       HTTP / Multipart Ingest
                                                  |
                                                  v
                                +-----------------------------------+
                                |       FastAPI Forensic Gateway    |
                                +-----------------+-----------------+
                                                  |
                  +-------------------------------+-------------------------------+
                  |                                                               |
                  v                                                               v
    +---------------------------+                                   +---------------------------+
    |   Security Ingest Guard   |                                   |  Forensic Module Router   |
    | - Magic Byte Validation   |                                   | - Modality Ingest Router  |
    | - Size & Format Limits    |                                   | - Unified Schemas         |
    | - SHA-256 Digesting       |                                   | - Job State Registry      |
    | - Temp Isolation (UUID)   |                                   +-------------+-------------+
    +---------------------------+                                                 |
                                                                                  |
              +-------------------------------------------------------------------+
              |
              +--> [ Image Forensics ]       --> ELA, 2D-FFT residuals, PRNU noise (Phase 2)
              +--> [ Video Forensics ]       --> Facial jitter, optical flow, atoms (Phase 2)
              +--> [ Audio Forensics ]       --> LFCC, vocoder spectral footprints (Phase 2)
              +--> [ Document Forensics ]    --> PDF streams, font embedding checks (Phase 2)
              +--> [ Provenance Forensics ]  --> C2PA / CAI, EXIF/XMP history (Phase 2)
              +--> [ Cross-Modal Forensics ] --> Audio-Visual LipSync coherence (Phase 2)
                                                          |
                                                          v
                                        +-----------------------------------+
                                        |    Scoring & Synthesis Engine     |
                                        |  - Calibrated Risk Evaluation     |
                                        |  - Explainable Report Synthesis   |
                                        +-----------------------------------+
```

---

## 3. Implementation Status (Phase 1 Baseline)

| Capability / Subsystem | Current State | Notes |
|---|---|---|
| **FastAPI REST Gateway** | **Implemented & Verified** | `/health`, `/`, `/docs`, `/api/v1/analyze`, `/api/v1/modules` |
| **Defensive Security Guard** | **Implemented & Verified** | Magic byte validation (JPEG, PNG, WebP, PDF, WAV, MP3, MP4), path sanitization, 50MB limit |
| **Unified Forensic Schemas** | **Implemented & Verified** | Pydantic v2 models for `Evidence`, `Finding`, `ModuleResult`, `OverallScore`, `AnalysisReport` |
| **Decoupled Scoring Engine** | **Implemented & Verified** | Decouples raw detector metrics from calibrated risk; returns `inconclusive` for baseline Phase 1 |
| **React + Vite Frontend** | **Implemented & Verified** | Dark cybersecurity theme, drag-and-drop intake, stage progress bar, report cards, export JSON |
| **Automated Backend Tests** | **Implemented & Verified** | 13/13 Pytest suite passing (security, health, upload ingestion) |
| **FSD & Diffusion Detectors** | *Planned (Phase 3)* | Integration scheduled after signal-processing baseline |
| **2D-FFT & Error Level Analysis** | *Planned (Phase 2)* | Classical image forensics |
| **PyMuPDF Stream Parser** | *Planned (Phase 2)* | PDF object and font embedding extraction |
| **Librosa Audio Vocoder Analysis**| *Planned (Phase 2)* | Acoustic synthetic voice identification |
| **C2PA Manifest Cryptography** | *Planned (Phase 4)* | Content Authenticity Initiative parser |

---

## 4. Technology Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS v4 (dark forensic theme)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (ASGI)
- **Runtime**: Python 3.12+
- **Data Validation**: Pydantic v2 & Pydantic-Settings
- **Server**: Uvicorn with standard workers
- **Testing**: Pytest, Pytest-Asyncio, HTTPX
- **Lightweight Foundations**: Pillow (imaging), NumPy

---

## 5. Repository Structure

```
xDeepFake/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # Central Axios client consuming VITE_API_URL
│   │   ├── components/      # RiskBadge, EvidenceCard, FindingCard, ModuleResultCard
│   │   ├── layouts/         # Navbar (with live API health ping), Footer
│   │   ├── pages/           # Dashboard, Upload, Report, Methodology
│   │   ├── types/           # Forensic TypeScript interfaces (mirrors Pydantic)
│   │   ├── utils/           # Byte formatters, risk style resolvers
│   │   ├── App.tsx          # Main tabbed forensic workspace
│   │   └── main.tsx         # Application entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── image.py         # Image forensic module stub
│   │   │   ├── document.py      # Document (PDF) forensic module stub
│   │   │   ├── video.py         # Video forensic module stub
│   │   │   ├── audio.py         # Audio forensic module stub
│   │   │   ├── provenance.py    # C2PA and metadata module stub
│   │   │   └── cross_modal.py   # Multi-modal correlation stub
│   │   ├── config.py            # Pydantic BaseSettings environment manager
│   │   ├── schemas.py           # Reusable forensic Pydantic v2 models
│   │   ├── security.py          # Magic-byte check, SHA-256, path sanitization
│   │   ├── scoring.py           # Decoupled forensic scoring engine
│   │   ├── report.py            # Forensic report builder
│   │   ├── jobs.py              # In-memory async job tracker
│   │   └── main.py              # FastAPI application gateway & routes
│   ├── tests/
│   │   ├── test_health.py       # Health and system endpoint tests
│   │   ├── test_security.py     # Magic bytes, sanitization tests
│   │   └── test_analyze.py      # Upload and pipeline verification tests
│   ├── requirements.txt
│   ├── pytest.ini
│   └── .env.example
│
├── sample_data/
│   └── README.md            # Guidelines for testing artifacts (no PII, no large binaries)
│
├── docs/
│   ├── ARCHITECTURE.md      # Detailed system design, data flow & security model
│   └── API.md               # Complete REST API specification with sample payloads
│
├── .gitignore               # Strict exclusions for models, logs, uploads, node_modules
├── LICENSE                  # MIT License
└── README.md
```

---

## 6. Local Quickstart

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: 3.12+ (tested on Python 3.12.10)
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/LostEmperor08/xDeepFake.git
cd xDeepFake
```

---

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python 3.12 virtual environment:
   - **Windows**:
     ```powershell
     py -3.12 -m venv .venv
     .venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3.12 -m venv .venv
     source .venv/bin/activate
     ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   ```

5. Run test suite:
   ```bash
   pytest
   ```

6. Start FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *FastAPI will run at `http://localhost:8000`. Interactive Swagger UI available at `http://localhost:8000/docs`.*

---

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   - **Windows (PowerShell)**:
     ```powershell
     npm.cmd install
     ```
   - **Linux / macOS**:
     ```bash
     npm install
     ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```

4. Verify TypeScript and production build:
   - **Windows**:
     ```powershell
     npm.cmd run build
     ```
   - **Linux / macOS**:
     ```bash
     npm run build
     ```

5. Start Vite development server:
   - **Windows**:
     ```powershell
     npm.cmd run dev
     ```
   - **Linux / macOS**:
     ```bash
     npm run dev
     ```
   *Frontend will run at `http://localhost:5173`.*

---

## 7. API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root system metadata |
| `GET` | `/health` | Live health, uptime, and active module list |
| `GET` | `/docs` | Interactive OpenAPI Swagger UI |
| `GET` | `/api/v1/modules` | List forensic modules and readiness states |
| `POST` | `/api/v1/analyze` | Ingest media artifact (multipart/form-data) and return forensic report |
| `GET` | `/api/v1/jobs/{job_id}` | Query job status and completed analysis report |

Refer to [`docs/API.md`](docs/API.md) for full payload schemas and `curl` examples.

---

## 8. Development & Verification Workflow

Run all checks prior to committing:

```bash
# 1. Backend tests & type integrity
cd backend
.venv\Scripts\activate      # or source .venv/bin/activate
pytest

# 2. Frontend build & TypeScript compilation
cd ../frontend
npm run build
```

---

## 9. Security & Responsible Disclosure

- Never commit real model checkpoints (`*.pt`, `*.bin`, `*.safetensors`) or API secrets to Git.
- Uploaded media files are held strictly in memory and temporary sandbox storage (`temp/uploads/`) and are removed immediately following feature extraction.
- For vulnerability reports, please open a security advisory or email the maintainers directly.

---

## 10. License

This project is licensed under the [MIT License](LICENSE).
