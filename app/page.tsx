"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Stage = "Applied" | "Awaiting reply" | "Interview" | "Offer" | "Rejected" | "Closed" | "Draft";
type View = "applications" | "outreach";

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

type OutreachStatus = "Draft ready" | "Sent" | "Replied" | "Not a fit";

type Outreach = {
  id: string;
  name: string;
  company: string;
  title: string;
  region: string;
  linkedin: string;
  status: OutreachStatus;
  angle: string;
  researchNote: string;
  message: string;
  shared: string;
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

const githubProfile = "https://github.com/HuzaifaBinShahid";

const seededOutreach: Outreach[] = [
  {
    id: "zeno-rocha",
    name: "Zeno Rocha",
    company: "Resend",
    title: "Founder & CEO",
    region: "San Francisco · remote team",
    linkedin: "https://www.linkedin.com/in/zenorocha/",
    status: "Draft ready",
    angle: "Developer experience, product surfaces, and AI-assisted workflows",
    researchNote: "Resend’s founder has recently shared rapid MCP adoption and a remote-company team culture.",
    message: "Hi Zeno — I’ve been following Resend’s focus on developer experience, and the recent growth in MCP usage caught my attention. I’m a frontend and mobile engineer from Lahore with around three years of React, Next.js, TypeScript, real-time, and API-heavy product work, plus React Native. If Resend ever needs hands-on help with a frontend feature, dashboard, or mobile surface, I’d be glad to share relevant work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "steven-tey",
    name: "Steven Tey",
    company: "Dub.co",
    title: "Founder & CEO",
    region: "Seattle · distributed product team",
    linkedin: "https://www.linkedin.com/in/steventey",
    status: "Draft ready",
    angle: "Open-source growth tooling, analytics dashboards, and integrations",
    researchNote: "Dub builds partner-growth infrastructure and has publicly emphasized shipping product integrations and developer experience.",
    message: "Hi Steven — I came across Dub’s work around partner growth infrastructure and the way you keep the product close to developers. I build React, Next.js, and TypeScript interfaces with dashboards, API integrations, state management, and performance in mind; I also ship React Native apps when a product needs mobile. If there is ever a frontend or product-surface backlog where extra hands would help, I’d be happy to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "vicente-escobar",
    name: "Vicente Escobar Blanc",
    company: "Cacttus",
    title: "Co-Founder & CTO",
    region: "Chile · startup team",
    linkedin: "https://www.linkedin.com/in/vicenteescobarblanc",
    status: "Draft ready",
    angle: "Next.js and React Native product work for a mobile-first insurtech",
    researchNote: "Cacttus is an insurtech product with a stack that includes Next.js and React Native.",
    message: "Hi Vicente — I read about Cacttus and liked that you are building across both the web and mobile product surfaces. I have around three years of React, Next.js, TypeScript, and React Native experience, including real-time features, maps, notifications, and API-driven flows. If Cacttus ever needs help moving a frontend or mobile feature forward, I’d be glad to share relevant work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "jan-vaclavik",
    name: "Jan Václavík",
    company: "Belcode",
    title: "CEO & Co-Founder",
    region: "Prague · startup studio",
    linkedin: "https://www.linkedin.com/in/vaclavikjan",
    status: "Draft ready",
    angle: "MVP delivery across React web and React Native mobile",
    researchNote: "Belcode focuses on turning startup concepts into shipped web and mobile products.",
    message: "Hi Jan — Belcode’s mix of product discovery and rapid MVP delivery stood out to me. I’m a frontend and mobile engineer with around three years of React, Next.js, TypeScript, and React Native work, including SaaS dashboards, real-time product features, and reusable UI patterns. If your studio ever needs support on a web or mobile delivery, I’d be happy to share work and see whether I can help: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "william-bowman",
    name: "William Bowman",
    company: "PageHub",
    title: "Founder",
    region: "Los Angeles · early-stage SaaS",
    linkedin: "https://www.linkedin.com/in/gcphost",
    status: "Draft ready",
    angle: "Next.js, Tailwind, visual editing, and performance-sensitive UI",
    researchNote: "PageHub recently launched as a visual layer on top of a Next.js and Tailwind stack.",
    message: "Hi William — I saw PageHub’s launch and liked the idea of a visual layer that still respects real Next.js and Tailwind code. I work in React, Next.js, TypeScript, and Tailwind, with experience building reusable UI, SaaS dashboards, API integrations, and performance-focused flows. If there is a UI or product feature where another frontend engineer could help, I’d be glad to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "andrew-mikhov",
    name: "Andrew Mikhov",
    company: "databerry.app",
    title: "Founder & Product Engineer",
    region: "Romania · product builder",
    linkedin: "https://ro.linkedin.com/in/weareandrei",
    status: "Draft ready",
    angle: "AI SaaS dashboards, integrations, and founder-product collaboration",
    researchNote: "Andrew has shipped several products in 2026, including an AI-powered founder dashboard.",
    message: "Hi Andrew — I came across databerry and liked the practical founder-dashboard angle. I’ve spent around three years building React, Next.js, and TypeScript product interfaces, including AI SaaS dashboards, React Query/Axios integrations, and real-time features; I also build with React Native. If you ever want an extra frontend pair of hands on a product experiment or feature, I’d be happy to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "sergiu-batrinac",
    name: "Sergiu Batrinac",
    company: "Early-stage SaaS products",
    title: "Co-Founder & Engineer",
    region: "Bucharest · product studio",
    linkedin: "https://ro.linkedin.com/in/sergiu-batrinac",
    status: "Draft ready",
    angle: "Production-ready SaaS interfaces and feature delivery",
    researchNote: "Sergiu presents his work around shipping TypeScript and Next.js SaaS products for early-stage companies.",
    message: "Hi Sergiu — I saw your work around helping early-stage teams turn product ideas into SaaS. I’m a frontend and mobile engineer with around three years in React, Next.js, TypeScript, SaaS dashboards, state management, and API-heavy product features. If you have a client build or product feature that could use reliable frontend support, I’d be glad to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "cristian-bote",
    name: "Cristian Bote",
    company: "Get AI Dev / SuperPrompts",
    title: "Founder & Product Builder",
    region: "Romania · remote",
    linkedin: "https://ro.linkedin.com/in/cristianbote",
    status: "Draft ready",
    angle: "AI products, React Native, and fast product iteration",
    researchNote: "Cristian builds AI and product systems with TypeScript, React, React Native, and Next.js.",
    message: "Hi Cristian — your work across Get AI Dev and product automation caught my attention, especially the mix of AI tooling and real product delivery. I build React, Next.js, TypeScript, and React Native features, including dashboards, real-time flows, notifications, maps, and API integrations. If one of your products or client projects needs extra frontend or mobile support, I’d be happy to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "m-robi",
    name: "M. Robi",
    company: "ProofEcho",
    title: "Founder",
    region: "Indonesia · SaaS builder",
    linkedin: "https://id.linkedin.com/in/m-robi",
    status: "Draft ready",
    angle: "SaaS product polish, dashboard UX, and testimonial-product surfaces",
    researchNote: "ProofEcho is a testimonial SaaS built around an embeddable product experience and analytics.",
    message: "Hi Robi — ProofEcho looks like a thoughtful product, especially the mix of collection flows, embeddable widgets, and analytics. I have around three years of React, Next.js, TypeScript, Tailwind, and API-driven product work, and I also build React Native applications. If you ever want help polishing a product surface, dashboard, or new feature, I’d be happy to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "marian-putirac",
    name: "Marian Putirac",
    company: "Independent dev studio",
    title: "Founder & Senior React Developer",
    region: "Romania · client product studio",
    linkedin: "https://ro.linkedin.com/in/marian-putirac-b7a3bab7",
    status: "Draft ready",
    angle: "React/Next.js and React Native capacity for client product work",
    researchNote: "Marian runs a development studio and has shipped web and cross-platform mobile products for clients.",
    message: "Hi Marian — I came across your work running a product-focused dev studio and the mix of React, Next.js, and React Native delivery. I’m a frontend and mobile engineer with around three years of experience in that same stack, including SaaS dashboards, APIs, real-time features, maps, and mobile notifications. If you ever need overflow support on a client delivery, I’d be happy to share work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
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

function OutreachBadge({ status }: { status: OutreachStatus }) {
  const tone = status === "Sent" ? "sent" : status === "Replied" ? "replied" : status === "Not a fit" ? "not-fit" : "draft";
  return <span className={`badge outreach-${tone}`}>{status}</span>;
}

function LinkedinLink({ href }: { href: string }) {
  return <a className="linkedin-link" href={href} target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile"><span>in</span> LinkedIn</a>;
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>(seededApplications);
  const [outreach, setOutreach] = useState<Outreach[]>(seededOutreach);
  const [view, setView] = useState<View>("applications");
  const [selectedId, setSelectedId] = useState("");
  const [selectedOutreachId, setSelectedOutreachId] = useState("");
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
    const savedOutreach = window.localStorage.getItem("application-ledger-outreach");
    if (savedOutreach) {
      try {
        const parsed = JSON.parse(savedOutreach) as Outreach[];
        if (Array.isArray(parsed) && parsed.length) setOutreach(parsed);
      } catch {
        // Keep the researched starter outreach if a saved record is invalid.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("application-ledger", JSON.stringify(applications));
  }, [applications, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("application-ledger-outreach", JSON.stringify(outreach));
  }, [outreach, hydrated]);

  const selected = applications.find((application) => application.id === selectedId);
  const selectedOutreach = outreach.find((contact) => contact.id === selectedOutreachId);
  const visibleApplications = useMemo(() => applications.filter((application) => {
    const matchesFilter = filter === "All" || application.stage === filter;
    const subject = `${application.company} ${application.role} ${application.location}`.toLowerCase();
    return matchesFilter && subject.includes(query.toLowerCase());
  }), [applications, filter, query]);

  const applied = applications.filter((application) => application.stage === "Applied" || application.stage === "Awaiting reply").length;
  const interviews = applications.filter((application) => application.stage === "Interview").length;
  const responseRate = applications.length ? Math.round((interviews / applications.filter((application) => application.stage !== "Draft" && application.stage !== "Closed").length || 0) * 100) : 0;
  const upcoming = applications.filter((application) => application.due && application.stage !== "Rejected" && application.stage !== "Closed").sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));
  const readyOutreach = outreach.filter((contact) => contact.status === "Draft ready").length;
  const sentOutreach = outreach.filter((contact) => contact.status === "Sent" || contact.status === "Replied").length;

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

  function updateOutreachStatus(status: OutreachStatus) {
    if (!selectedOutreach) return;
    setOutreach((current) => current.map((contact) => contact.id === selectedOutreach.id ? { ...contact, status } : contact));
  }

  return (
    <main>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><span>Application Ledger</span></div>
        <p className="sidebar-copy">A deliberate record of your search, so every follow-up has a reason.</p>
        <nav>
          <button className={view === "applications" && filter === "All" ? "nav-item active" : "nav-item"} onClick={() => { setView("applications"); setFilter("All"); setSelectedOutreachId(""); }}><span>▦</span> All applications <b>{applications.length}</b></button>
          <button className={view === "applications" && filter === "Interview" ? "nav-item active" : "nav-item"} onClick={() => { setView("applications"); setFilter("Interview"); setSelectedOutreachId(""); }}><span>◌</span> Interviews <b>{interviews}</b></button>
          <button className={view === "outreach" ? "nav-item active" : "nav-item"} onClick={() => { setView("outreach"); setSelectedId(""); }}><span>↗</span> Founder outreach <b>{readyOutreach}</b></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="quiet-note"><span className="dot" /> Your data stays in this browser</div>
          <button className="add-button" onClick={() => setIsAdding(true)}>+ Add application</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{view === "applications" ? "YOUR JOB SEARCH" : "OUTREACH PIPELINE"}</p>
            <h1>{view === "applications" ? "Keep the search moving." : "Start useful conversations."}</h1>
          </div>
          {view === "applications" && <button className="add-button top-add" onClick={() => setIsAdding(true)}>+ Add application</button>}
        </header>

        <section className="metrics" aria-label={view === "applications" ? "Application statistics" : "Outreach statistics"}>
          {view === "applications" ? <>
            <article><span>Total tracked</span><strong>{applications.length}</strong><small>Every opportunity in one place</small></article>
            <article><span>Active applications</span><strong>{applied}</strong><small>Applied or waiting for a reply</small></article>
            <article><span>Interview rate</span><strong>{responseRate}%</strong><small>Interviews from submitted applications</small></article>
            <article><span>Next follow-up</span><strong>{upcoming[0]?.due ? formatDate(upcoming[0].due).replace(", 2026", "") : "—"}</strong><small>{upcoming[0]?.company ?? "No follow-ups scheduled"}</small></article>
          </> : <>
            <article><span>Researched contacts</span><strong>{outreach.length}</strong><small>Public founder and product-lead profiles</small></article>
            <article><span>Drafts ready</span><strong>{readyOutreach}</strong><small>Personalized; no message sent yet</small></article>
            <article><span>Contacted</span><strong>{sentOutreach}</strong><small>Update only after a real send</small></article>
            <article><span>Shared with each</span><strong>GitHub</strong><small>No CV attached unless you choose to send it</small></article>
          </>}
        </section>

        {view === "applications" ? <section className="board">
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
              <button key={application.id} onClick={() => { setSelectedId(application.id); setSelectedOutreachId(""); }} className={selected?.id === application.id ? "application-row selected" : "application-row"}>
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
        </section> : <section className="outreach-board">
          <div className="board-header outreach-header">
            <div>
              <h2>Founder & product outreach</h2>
              <p>Ten researched targets. Each note leads with useful delivery skills, not a generic request for a job.</p>
            </div>
            <span className="research-label">PUBLIC RESEARCH</span>
          </div>
          <div className="outreach-list">
            {outreach.map((contact) => <div key={contact.id} role="button" tabIndex={0} className={selectedOutreach?.id === contact.id ? "outreach-row selected" : "outreach-row"} onClick={() => { setSelectedOutreachId(contact.id); setSelectedId(""); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedOutreachId(contact.id); setSelectedId(""); } }}>
              <div className="company-avatar">{contact.name.slice(0, 1)}</div>
              <div className="outreach-person"><strong>{contact.name}</strong><span>{contact.title} · {contact.company}</span></div>
              <div className="outreach-angle">{contact.angle}</div>
              <OutreachBadge status={contact.status} />
              <LinkedinLink href={contact.linkedin} />
              <span className="chevron">›</span>
            </div>)}
          </div>
        </section>}
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

      {selectedOutreach && <aside className="detail-panel outreach-detail">
        <div className="detail-header"><button className="icon-button" onClick={() => setSelectedOutreachId("")} aria-label="Close outreach details">×</button><OutreachBadge status={selectedOutreach.status} /></div>
        <div className="detail-title"><div className="company-avatar large">{selectedOutreach.name.slice(0, 1)}</div><div><p className="eyebrow">{selectedOutreach.company}</p><h2>{selectedOutreach.name}</h2><p>{selectedOutreach.title}</p></div></div>
        <div className="detail-meta"><span>⌖ {selectedOutreach.region}</span><span>◷ Research added Sep 22, 2026</span></div>
        <label className="field-label">OUTREACH STATUS<select value={selectedOutreach.status} onChange={(event) => updateOutreachStatus(event.target.value as OutreachStatus)}>{(["Draft ready", "Sent", "Replied", "Not a fit"] as OutreachStatus[]).map((status) => <option key={status}>{status}</option>)}</select></label>
        <section className="next-card"><p className="eyebrow">WHY THIS IS RELEVANT</p><strong>{selectedOutreach.angle}</strong><span>{selectedOutreach.researchNote}</span></section>
        <section className="detail-section"><div className="section-heading"><h3>Profile & materials</h3><LinkedinLink href={selectedOutreach.linkedin} /></div><dl><div><dt>Message attachment</dt><dd>{selectedOutreach.shared}</dd></div><div><dt>Public work link</dt><dd><a href={githubProfile} target="_blank" rel="noreferrer">HuzaifaBinShahid ↗</a></dd></div></dl></section>
        <section className="detail-section message-draft"><div className="section-heading"><h3>Message draft</h3><button className="text-button" onClick={() => navigator.clipboard?.writeText(selectedOutreach.message)}>Copy</button></div><p>{selectedOutreach.message}</p><small>Draft only — it has not been sent. Review the profile and message before contacting anyone.</small></section>
      </aside>}

      {isAdding && <div className="modal-backdrop" role="presentation"><form className="add-modal" onSubmit={addApplication}>
        <div className="modal-heading"><div><p className="eyebrow">NEW RECORD</p><h2>Add an application</h2></div><button type="button" className="icon-button" onClick={() => setIsAdding(false)}>×</button></div>
        <div className="form-grid"><label>Company<input name="company" required placeholder="e.g. Acme" /></label><label>Role<input name="role" required placeholder="e.g. Frontend Engineer" /></label><label>Location<input name="location" placeholder="Remote · Pakistan" /></label><label>Source<input name="source" placeholder="Company site, referral…" /></label><label>Stage<select name="stage" defaultValue="Draft">{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label><label>Applied on<input name="appliedOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label><label>Compensation<input name="compensation" placeholder="PKR 180,000/month" /></label><label>Follow-up due<input name="due" type="date" /></label><label className="wide">Job link<input name="link" type="url" placeholder="https://" /></label><label className="wide">Next action<input name="nextAction" placeholder="What needs to happen next?" /></label><label className="wide">Notes<textarea name="notes" rows={3} placeholder="Why this role matters, hiring contact, concerns…" /></label></div>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setIsAdding(false)}>Cancel</button><button className="add-button" type="submit">Add to ledger</button></div>
      </form></div>}
    </main>
  );
}
