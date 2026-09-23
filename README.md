# Application Ledger

A focused job-application tracker for keeping a real job search organized: applications, replies, interviews, follow-ups, compensation notes, and outcomes in one calm workspace.

## Why it exists

Job hunting often ends up scattered across browser tabs, email threads, and notes. Application Ledger makes the important information easy to review before a follow-up is missed or a recruiter conversation loses context.

## What it tracks

- Application stages: Draft, Applied, Awaiting reply, Interview, Offer, Rejected, and Closed
- Company, role, location, source, application date, job link, and contact details
- Compensation expectations and follow-up dates
- Next actions, notes, and a short activity history for every opportunity
- Search and stage filters for quickly finding active or closed applications
- A lightweight application-entry form for adding new roles
- A separate founder and product-outreach pipeline with public LinkedIn links, researched context, message drafts, and an explicit record of what was shared

## Privacy

This version is intentionally local-first. Records are stored in the browser's local storage; the app does not connect to Gmail, LinkedIn, Google Drive, or any job board. Outreach entries are drafts and status records only: the app never sends a message or attaches a CV. Clearing browser storage will reset locally saved changes.

## Stack

- Next.js 16
- React 19
- TypeScript
- Plain CSS, with no component-library dependency

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production check

```bash
npm run build
```

## Future directions

- CSV import and export for backups
- Follow-up reminders and a calendar view
- Optional authentication and encrypted cloud sync
- Reporting for response, interview, and offer rates over time
