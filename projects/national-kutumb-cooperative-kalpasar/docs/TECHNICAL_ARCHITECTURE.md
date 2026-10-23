# तकनीकी वास्तुकला

## MVP सिद्धांत
पहला चरण mobile-first, low-cost और read-only demo है। वास्तविक भुगतान/सदस्य व्यक्तिगत डेटा को तब तक सक्षम नहीं करना है जब तक संस्था और कानूनी ढाँचा तैयार न हो।

## प्रस्तावित स्टैक
- Frontend: Next.js/React या प्रारंभिक static HTML/CSS/JavaScript
- API: FastAPI (Python) या समकक्ष REST API
- Database: PostgreSQL/Supabase
- Authentication: role-based access; MFA for administrators
- File storage: restricted document storage with checksums and versioning
- Hosting: static hosting for public demo; production hosting only after security review
- Reporting: CSV/PDF export, audit logs, monthly ledger reconciliation
- Integrations: payment provider only after bank/legal approval; no secret keys in client-side code

## Modules
1. Public dashboard: proposed targets, verified receipts, spending, remaining balance, sources.
2. Membership registry: membership status and fee class; never expose private data publicly.
3. Grant register: receipt ID, amount, date, permitted purpose, settlement status, refund status.
4. Project budget: official cost source, date, version, financing gap, scenario calculator.
5. Expert/volunteer register: expertise and voluntary consent.
6. Document register: DPR references, official correspondence, meeting minutes, audit reports.
7. Assembly/meeting module: agenda, quorum, resolutions, vote record, minutes.
8. Certificate verification: random public reference; no public personal identifiers.
9. Audit and complaints: immutable event log, issue tracker, escalation and resolution status.
10. Government proposal tracker: recipient, date, channel, dispatch/reference number, response, next action.

## Roles
- Public: read public reports and source documents.
- Member: manage own membership and consented profile.
- Finance officer: prepare transactions, not approve own transaction.
- Approver: approve disbursement within authority.
- Auditor: read-only access to ledgers and evidence.
- Administrator: platform settings; cannot erase audit history.
- Public reviewer: view published reports and meeting resolutions.

## Security requirements
- HTTPS, MFA, least privilege, encrypted backups, secrets management.
- Server-side validation; no bank secrets or API keys in frontend.
- Append-only audit events; corrections create reversal entries rather than deleting history.
- Rate limits, input validation, security headers, dependency updates.
- Data minimization and documented retention policy.
- Independent penetration/security test before accepting money.

## Current prototype
index.html uses browser-side sample calculations only. It stores no personal data, sends no network requests and has no payment function. It is a demonstration, not a production finance application.
