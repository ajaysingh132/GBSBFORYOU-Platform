
# EKAANT AI TYPING — MASTER FILE PLAN

**Project:** Ekaant International AI Typing System  
**Organization:** GBSBFORYOU  
**Founder:** Ajay Singh Chouhan  
**Status:** Consolidation in Progress  
**Master Strategy:** Multiple Versions → One Master Software

---

## 1. उद्देश्य

Ekaant AI Typing की अलग-अलग repositories को एक ही software की development history माना जाएगा।

किसी भी उपयोगी code या functionality को बिना जांच के हटाया नहीं जाएगा।

लक्ष्य:

> एक पूर्ण, सुरक्षित, mobile-first और maintainable Master Ekaant AI Typing System तैयार करना।

---

## 2. Source Repository Map

| Source Repository | मुख्य भूमिका | Master Action |
|---|---|---|
| `ekant-ai-typing` | PWA / browser baseline | MERGE |
| `ekant-ai-typing-system` | UI/system implementation | REVIEW + MERGE |
| `ekant-ai-typing-for-you` | Advanced frontend | PRIMARY FRONTEND CANDIDATE |
| `ekant-ai-typing-for-yourself-` | Voice + Camera + OCR UI | MERGE |
| `ekant-ai-typing-for-you-1` | FastAPI/OCR backend | PRIMARY BACKEND CANDIDATE |

---

## 3. Master File Structure

```text
ekant-ai-typing/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── voice.js
│   │   ├── ocr.js
│   │   ├── camera.js
│   │   ├── text-tools.js
│   │   └── export.js
│   │
│   └── icons/
│
├── backend/
│   ├── main.py
│   ├── ocr.py
│   ├── config.py
│   └── requirements.txt
│
├── pwa/
│   ├── manifest.json
│   └── service-worker.js
│
├── docs/
│   ├── README.md
│   ├── FEATURES.md
│   ├── API.md
│   └── SECURITY.md
│
└── legacy/
    └── SOURCE-VERSIONS.md
