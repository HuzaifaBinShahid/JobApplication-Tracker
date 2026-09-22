"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Stage = "Applied" | "Awaiting reply" | "Interview" | "Offer" | "Rejected" | "Closed" | "Draft";

type Application = {
  id: string;
  company: string;
  role: string;
  location: string;
  source: string;
  stage: Stage;
  appliedOn: string;
  compensation?: string;
  link?: string;
  nextAction: string;
  due?: string;
  contact?: string;
  notes: string;
  activity: { date: string; text: string }[];
};

const stages: Stage[] = ["Applied", "Awaiting reply", "Interview", "Offer", "Rejected", "Closed", "Draft"];

const seededApplications: Application[] = [
  {
    id: "eventmobi",
    company: "EventMobi",
    role: "Front End Engineer",
    location: "Remote · Canada",
    source: "BambooHR",
    stage: "Applied",
    appliedOn: "2026-09-22",
    compensation: "CAD 21,000/year entered",
    nextAction: "Wait for an acknowledgement or recruiter reply",
    due: "2026-10-06",
    notes: "Submitted successfully through the company application.",
    activity: [{ date: "Sep 22", text: "Application submitted" }]
  },
  {
    id: "cryvon",
    company: "CryVon",
    role: "Senior Frontend Developer",
    location: "Remote",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-09-22",
    compensation: "Not shared",
    nextAction: "Follow up if there is no response after 7–10 days",
    due: "2026-10-02",
    contact: "usmanrasheed.dev@gmail.com",
    notes: "CV and a tailored note were emailed directly.",
    activity: [{ date: "Sep 22", text: "Application email sent" }]
  },
  {
    id: "dionix",
    company: "DIONIX AI",
    role: "Frontend Engineer (React / Next.js)",
    location: "Islamabad, Pakistan",
    source: "Company careers page",
    stage: "Applied",
    appliedOn: "2026-09-22",
    compensation: "USD 1,200/month entered",
    nextAction: "Wait for their stated five-business-day review window",
    due: "2026-09-29",
    notes: "Applied with React/Next.js-focused cover letter and CV.",
    activity: [{ date: "Sep 22", text: "Application submitted" }]
  },
  {
    id: "turing",
    company: "Turing Technologies",
    role: "Frontend Developer (React / Next)",
    location: "Islamabad / Remote",
    source: "Google Form",
    stage: "Draft",
    appliedOn: "2026-09-22",
    compensation: "PKR 180,000/month entered",
    nextAction: "Attach CV PDF, then submit the prepared form",
    contact: "Google Form",
    notes: "All fields prepared as Lahore-based. CV upload remains pending.",
    activity: [{ date: "Sep 22", text: "Draft prepared" }]
  },
  {
    id: "cauders",
    company: "Cauders",
    role: "Frontend Developer",
    location: "Lahore, Pakistan",
    source: "Company careers page",
    stage: "Closed",
    appliedOn: "2026-09-22",
    nextAction: "Revisit only if the employer repairs the application page",
    notes: "Submission returned an unexpected server error; no application was sent.",
    activity: [{ date: "Sep 22", text: "Application blocked by server error" }]
  }
];

const stageTone: Record<Stage, string> = {
  Applied: "applied",
  "Awaiting reply": "waiting",
  Interview: "interview",
  Offer: "offer",
  Rejected: "rejected",
  Closed: "closed",
  Draft: "draft"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function StageBadge({ stage }: { stage: Stage }) {
  return <span className={`badge ${stageTone[stage]}`}>{stage}</span>;
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>(seededApplications);
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState<"All" | Stage>("All");
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("application-ledger");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Application[];
        if (Array.isArray(parsed) && parsed.length) setApplications(parsed);
      } catch {
        // Keep the starter data if a saved record is invalid.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("application-ledger", JSON.stringify(applications));
  }, [applications, hydrated]);

  const selected = applications.find((application) => application.id === selectedId);
  const visibleApplications = useMemo(() => applications.filter((application) => {
    const matchesFilter = filter === "All" || application.stage === filter;
    const subject = `${application.company} ${application.role} ${application.location}`.toLowerCase();
    return matchesFilter && subject.includes(query.toLowerCase());
  }), [applications, filter, query]);

  const applied = applications.filter((application) => application.stage === "Applied" || application.stage === "Awaiting reply").length;
  const interviews = applications.filter((application) => application.stage === "Interview").length;
  const responseRate = applications.length ? Math.round((interviews / applications.filter((application) => application.stage !== "Draft" && application.stage !== "Closed").length || 0) * 100) : 0;
  const upcoming = applications.filter((application) => application.due && application.stage !== "Rejected" && application.stage !== "Closed").sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));

  function updateSelected(update: Partial<Application>, activityText?: string) {
    if (!selected) return;
    setApplications((current) => current.map((application) => application.id === selected.id ? {
      ...application,
      ...update,
      activity: activityText ? [{ date: "Today", text: activityText }, ...application.activity] : application.activity
    } : application));
  }

  function addApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company") || "").trim();
    const role = String(data.get("role") || "").trim();
    if (!company || !role) return;
    const application: Application = {
      id: crypto.randomUUID(),
      company,
      role,
      location: String(data.get("location") || "Remote").trim(),
      source: String(data.get("source") || "Direct application").trim(),
      stage: String(data.get("stage") || "Draft") as Stage,
      appliedOn: String(data.get("appliedOn") || new Date().toISOString().slice(0, 10)),
      compensation: String(data.get("compensation") || "").trim() || undefined,
      link: String(data.get("link") || "").trim() || undefined,
      nextAction: String(data.get("nextAction") || "Add a next action").trim(),
      due: String(data.get("due") || "") || undefined,
      notes: String(data.get("notes") || "").trim(),
      activity: [{ date: "Today", text: "Application added to the ledger" }]
    };
    setApplications((current) => [application, ...current]);
    setSelectedId(application.id);
    setIsAdding(false);
  }

  return (
    <main>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><span>Application Ledger</span></div>
        <p className="sidebar-copy">A deliberate record of your search, so every follow-up has a reason.</p>
        <nav>
          <button className="nav-item active"><span>▦</span> All applications <b>{applications.length}</b></button>
          <button className="nav-item" onClick={() => setFilter("Interview")}><span>◌</span> Interviews <b>{interviews}</b></button>
          <button className="nav-item" onClick={() => setFilter("Rejected")}><span>↗</span> Outcomes</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="quiet-note"><span className="dot" /> Your data stays in this browser</div>
          <button className="add-button" onClick={() => setIsAdding(true)}>+ Add application</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR JOB SEARCH</p>
            <h1>Keep the search moving.</h1>
          </div>
          <button className="add-button top-add" onClick={() => setIsAdding(true)}>+ Add application</button>
        </header>

        <section className="metrics" aria-label="Application statistics">
          <article><span>Total tracked</span><strong>{applications.length}</strong><small>Every opportunity in one place</small></article>
          <article><span>Active applications</span><strong>{applied}</strong><small>Applied or waiting for a reply</small></article>
          <article><span>Interview rate</span><strong>{responseRate}%</strong><small>Interviews from submitted applications</small></article>
          <article><span>Next follow-up</span><strong>{upcoming[0]?.due ? formatDate(upcoming[0].due).replace(", 2026", "") : "—"}</strong><small>{upcoming[0]?.company ?? "No follow-ups scheduled"}</small></article>
        </section>

        <section className="board">
          <div className="board-header">
            <div>
              <h2>Applications</h2>
              <p>{visibleApplications.length} shown · updated as things actually happen</p>
            </div>
            <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or role" /></label>
          </div>
          <div className="filters" role="tablist" aria-label="Filter applications">
            {(["All", ...stages] as const).map((stage) => <button key={stage} onClick={() => setFilter(stage)} className={filter === stage ? "filter selected" : "filter"}>{stage}</button>)}
          </div>
          <div className="application-list">
            {visibleApplications.map((application) => (
              <button key={application.id} onClick={() => setSelectedId(application.id)} className={selected?.id === application.id ? "application-row selected" : "application-row"}>
                <div className="company-avatar">{application.company.slice(0, 1)}</div>
                <div className="application-main"><strong>{application.company}</strong><span>{application.role}</span></div>
                <div className="application-location">{application.location}</div>
                <div className="application-date">{formatDate(application.appliedOn)}</div>
                <StageBadge stage={application.stage} />
                <span className="chevron">›</span>
              </button>
            ))}
            {!visibleApplications.length && <div className="empty-state">Nothing matches this view. Try another filter or add a new opportunity.</div>}
          </div>
        </section>
      </section>

      {selected && <aside className="detail-panel">
        <div className="detail-header"><button className="icon-button" onClick={() => setSelectedId("")} aria-label="Close details">×</button><StageBadge stage={selected.stage} /></div>
        <div className="detail-title"><div className="company-avatar large">{selected.company.slice(0, 1)}</div><div><p className="eyebrow">{selected.source}</p><h2>{selected.company}</h2><p>{selected.role}</p></div></div>
        <div className="detail-meta"><span>⌖ {selected.location}</span><span>◷ Started {formatDate(selected.appliedOn)}</span></div>
        <label className="field-label">CURRENT STAGE<select value={selected.stage} onChange={(event) => updateSelected({ stage: event.target.value as Stage }, `Stage changed to ${event.target.value}`)}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
        <section className="next-card"><p className="eyebrow">NEXT ACTION</p><strong>{selected.nextAction}</strong>{selected.due && <span>Due {formatDate(selected.due)}</span>}</section>
        <section className="detail-section"><div className="section-heading"><h3>Application record</h3>{selected.link && <a href={selected.link} target="_blank" rel="noreferrer">Open listing ↗</a>}</div>
          <dl><div><dt>Compensation</dt><dd>{selected.compensation || "Not recorded"}</dd></div><div><dt>Contact</dt><dd>{selected.contact || "Not recorded"}</dd></div></dl>
        </section>
        <section className="detail-section"><div className="section-heading"><h3>Notes</h3><button className="text-button" onClick={() => { const note = window.prompt("Update notes", selected.notes); if (note !== null) updateSelected({ notes: note }, "Notes updated"); }}>Edit</button></div><p className="notes">{selected.notes || "No notes yet."}</p></section>
        <section className="detail-section timeline"><h3>Activity</h3>{selected.activity.map((item, index) => <div className="timeline-item" key={`${item.date}-${index}`}><span className="timeline-dot" /><div><strong>{item.text}</strong><small>{item.date}</small></div></div>)}</section>
      </aside>}

      {isAdding && <div className="modal-backdrop" role="presentation"><form className="add-modal" onSubmit={addApplication}>
        <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Add an application</h2></div><button type="button" className="icon-button" onClick={() => setIsAdding(false)}>×</button></div>
        <div className="form-grid"><label>Company<input name="company" required placeholder="e.g. Acme" /></label><label>Role<input name="role" required placeholder="e.g. Frontend Engineer" /></label><label>Location<input name="location" placeholder="Remote · Pakistan" /></label><label>Source<input name="source" placeholder="Company site, referral…" /></label><label>Stage<select name="stage" defaultValue="Draft">{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label><label>Applied on<input name="appliedOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label><label>Compensation<input name="compensation" placeholder="PKR 180,000/month" /></label><label>Follow-up due<input name="due" type="date" /></label><label className="wide">Job link<input name="link" type="url" placeholder="https://" /></label><label className="wide">Next action<input name="nextAction" placeholder="What needs to happen next?" /></label><label className="wide">Notes<textarea name="notes" rows={3} placeholder="Why this role matters, hiring contact, concerns…" /></label></div>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setIsAdding(false)}>Cancel</button><button className="add-button" type="submit">Add to ledger</button></div>
      </form></div>}
    </main>
  );
}
