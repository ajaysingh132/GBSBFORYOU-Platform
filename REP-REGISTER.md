# GBSBFORYOU Repository Register (REP)

**Document ID:** REP-REGISTER  
**Version:** 1.0  
**Status:** Initial Audit  
**Organization:** GBSBFORYOU  
**Purpose:** Repository inventory, project lineage, duplication analysis and consolidation

---

## 1. उद्देश्य

यह Register GBSBFORYOU से संबंधित सभी GitHub repositories का
एक केंद्रीय रिकॉर्ड है।

इसका उद्देश्य:

1. सभी repositories की पहचान करना।
2. प्रत्येक repository का वास्तविक उद्देश्य दर्ज करना।
3. समान या overlapping repositories की पहचान करना।
4. मूल Project और उसके derivative repositories को अलग करना।
5. Active, Development, Archive और Duplicate repositories को वर्गीकृत करना।
6. प्रत्येक project की तकनीकी lineage निर्धारित करना।
7. भविष्य में अनावश्यक repositories को consolidate करना।

---

# 2. Classification Policy

किसी repository को केवल उसके नाम के आधार पर duplicate नहीं माना जाएगा।

### Classification Rule

> समान नाम ≠ Duplicate

Duplicate अथवा derivative निर्धारित करने के लिए निम्न प्रमाण देखे जाएंगे:

- Repository purpose
- README
- Source code
- File structure
- Commit history
- Deployment
- Dependencies
- Shared assets
- Shared database/API
- Project documentation
- Copyright/author information
- Relationship with another repository

---

# 3. Repository Status

हर repository को निम्न में से एक Status दिया जाएगा:

| Status | अर्थ |
|---|---|
| ACTIVE | वर्तमान में मुख्य उपयोग में |
| DEVELOPMENT | सक्रिय development में |
| MVP | प्रारंभिक prototype/MVP |
| EXPERIMENTAL | प्रयोगात्मक project |
| DERIVATIVE | किसी दूसरे project से निकला हुआ |
| DUPLICATE | वास्तविक duplicate |
| ARCHIVE | पुराना लेकिन सुरक्षित रखना आवश्यक |
| MERGE-CANDIDATE | दूसरे project में merge किया जा सकता है |
| UNKNOWN | अभी audit आवश्यक |

---

# 4. Repository Register

| REP ID | Repository | Project Family | Purpose | Status | Parent REP | Action |
|---|---|---|---|---|---|---|
| REP-001 | TBD | GBSBFORYOU Core | मुख्य platform | UNKNOWN | — | Audit |
| REP-002 | TBD | Ekaant | Ekaant project | UNKNOWN | — | Audit |
| REP-003 | TBD | Publishing | eBook/Publishing | UNKNOWN | — | Audit |
| REP-004 | TBD | AI Media | AI media tools | UNKNOWN | — | Audit |
| REP-005 | TBD | Education | Digital education | UNKNOWN | — | Audit |
| REP-006 | TBD | Digital Gurukul | AI education | UNKNOWN | — | Audit |
| REP-007 | TBD | Language | Banjara/Gor Boli | UNKNOWN | — | Audit |
| REP-008 | TBD | Translation | Language translation | UNKNOWN | — | Audit |
| REP-009 | TBD | Voice AI | Voice/Voice cloning | UNKNOWN | — | Audit |
| REP-010 | TBD | AI Teacher | AI teaching system | UNKNOWN | — | Audit |
| REP-011 | TBD | Web | Websites/PWA | UNKNOWN | — | Audit |
| REP-012 | TBD | Mobile | Mobile applications | UNKNOWN | — | Audit |
| REP-013 | TBD | Government | Government/public projects | UNKNOWN | — | Audit |
| REP-014 | TBD | Parliament | Parliamentary projects | UNKNOWN | — | Audit |
| REP-015 | TBD | Research | Research systems | UNKNOWN | — | Audit |
| REP-016 | TBD | Constitution | Constitutional projects | UNKNOWN | — | Audit |
| REP-017 | TBD | Community | Community projects | UNKNOWN | — | Audit |
| REP-018 | TBD | Banjara | Banjara projects | UNKNOWN | — | Audit |
| REP-019 | TBD | GBSBFORYOU AI | AI platform | UNKNOWN | — | Audit |
| REP-020 | TBD | AI Office | AI Office Suite | UNKNOWN | — | Audit |
| REP-021 | TBD | Documents | Document automation | UNKNOWN | — | Audit |
| REP-022 | TBD | Knowledge Base | Knowledge management | UNKNOWN | — | Audit |
| REP-023 | TBD | Social Manager | Social media management | UNKNOWN | — | Audit |
| REP-024 | TBD | YouTube | YouTube management | UNKNOWN | — | Audit |
| REP-025 | TBD | WordPress | WordPress management | UNKNOWN | — | Audit |
| REP-026 | TBD | WhatsApp | Community management | UNKNOWN | — | Audit |
| REP-027 | TBD | Google Drive | Document/Drive integration | UNKNOWN | — | Audit |
| REP-028 | TBD | Marketplace | Marketplace projects | UNKNOWN | — | Audit |
| REP-029 | TBD | Games | Game projects | UNKNOWN | — | Audit |
| REP-030 | TBD | Culture | Cultural projects | UNKNOWN | — | Audit |
| REP-031 | TBD | Sanskrit AI | Sanskrit AI systems | UNKNOWN | — | Audit |
| REP-032 | TBD | Indic AI | Indian language AI | UNKNOWN | — | Audit |
| REP-033 | TBD | Browser | Browser/Web tools | UNKNOWN | — | Audit |
| REP-034 | TBD | GDSF | GDSF projects | UNKNOWN | — | Audit |
| REP-035 | TBD | NST | NST projects | UNKNOWN | — | Audit |
| REP-036 | TBD | Research Tools | Research utilities | UNKNOWN | — | Audit |
| REP-037 | TBD | Experimental | Experimental repositories | UNKNOWN | — | Audit |
| REP-038 | TBD | Other | Unclassified repositories | UNKNOWN | — | Audit |

---

# 5. Project Family Structure

एक Project Family में निम्न प्रकार के repositories हो सकते हैं:

```text
PROJECT FAMILY
│
├── CORE
│   └── Main repository
│
├── FRONTEND
│   └── Web / PWA / UI
│
├── MOBILE
│   └── Android / Flutter
│
├── BACKEND
│   └── API / Server
│
├── AI
│   └── AI / ML / Prompt / Knowledge Base
│
├── DATA
│   └── Database / Dataset
│
├── DOCUMENTATION
│   └── Docs / Constitution / Research
│
└── ARCHIVE
    └── Old versions