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
    id: "aklikx-technologies-website-developer",
    company: "Aklikx Technologies",
    role: "Website Developer · Project-based",
    location: "Remote · Pakistan",
    source: "Recruiter LinkedIn post · direct email + LinkedIn InMail",
    stage: "Applied",
    appliedOn: "2026-10-14",
    link: "https://www.linkedin.com/posts/fatimah-tahir-332436239_hiring-webdeveloper-websitedevelopment-share-7515823689305600000-69sj/",
    nextAction: "Wait for Fatimah Tahir or the Aklikx team to discuss project requirements",
    due: "2026-10-21",
    contact: "hrfatimahtahir@gmail.com",
    notes: "Applied directly to the project-based remote Website Developer opening. The latest live-app CV was attached, with clickable GitHub and Repo Cards portfolio links in the email. Fatimah Tahir, Aklikx Technologies' technical recruiter, also received a concise LinkedIn InMail confirming the application.",
    activity: [
      { date: "Oct 14", text: "LinkedIn InMail sent to the recruiter" },
      { date: "Oct 14", text: "Tailored application email sent with CV attached" }
    ]
  },
  {
    id: "constructor-retail-media",
    company: "Constructor",
    role: "Full Stack Engineer: Retail Media",
    location: "Remote · EMEA · applied from Lahore, Pakistan",
    source: "Constructor careers via Remote React",
    stage: "Applied",
    appliedOn: "2026-10-13",
    link: "https://jobs.ashbyhq.com/constructor/815739c5-aba3-4b08-af02-57e0057a46b0",
    nextAction: "Watch for a response from Constructor's Retail Media team",
    due: "2026-10-20",
    notes: "Submitted with the latest live-app CV, LinkedIn profile, and a focused cover letter. The application accurately highlights three years of React, TypeScript, Next.js, React Native, dashboards, real-time features, and production SaaS work, without claiming the role's Python, SQL, cloud, or senior-level requirements.",
    activity: [{ date: "Oct 13", text: "Application submitted and receipt confirmed" }]
  },
  {
    id: "programmer-lab-javascript-developer",
    company: "Programmer Lab",
    role: "JavaScript Developer",
    location: "Lahore, Pakistan · remote post, Lahore-based company",
    source: "Direct email from company LinkedIn post",
    stage: "Applied",
    appliedOn: "2026-10-13",
    link: "https://www.linkedin.com/jobs/view/javascript-developer-at-programmer-lab-pvt-ltd-4475684647",
    nextAction: "Watch for a reply from Programmer Lab's hiring team",
    due: "2026-10-20",
    contact: "careers@programmerlab.co",
    notes: "The formal LinkedIn listing is closed, but the active company contact post explicitly invited CV applications by email. Sent the latest live-app CV and a tailored note connecting Hopn real-time mobile work, React and Next.js delivery, REST integrations, SaaS interfaces, and Playwright and Puppeteer workflows.",
    activity: [{ date: "Oct 13", text: "Tailored application email sent with CV attached" }]
  },
  {
    id: "glitch-devs-frontend-developer",
    company: "Glitch Devs",
    role: "Frontend Developer (React and Next.js)",
    location: "Remote · international applicant from Lahore, Pakistan",
    source: "Glitch Devs careers",
    stage: "Interview",
    appliedOn: "2026-10-12",
    compensation: "USD 1,000/month entered",
    link: "https://glitchdevs.com/jobs/frontend-developer-react-and-next-js-glitch-devs",
    nextAction: "Wait for Glitch Devs to review the completed online assessment",
    due: "2026-10-21",
    notes: "Submitted with the latest live-app CV and a tailored note focused on production React, Next.js, TypeScript, Tailwind, responsive interfaces, Playwright and Puppeteer workflows, and Hopn real-time mobile features. Glitch Devs then invited Huzaifa to a 20-question, 30-minute online test, which he completed on Oct 14.",
    activity: [
      { date: "Oct 14", text: "Online assessment completed" },
      { date: "Oct 14", text: "Shortlisted for the online assessment" },
      { date: "Oct 12", text: "Application submitted and receipt confirmed" }
    ]
  },
  {
    id: "welvaart-react-developer",
    company: "Welvaart",
    role: "React Developer",
    location: "Remote · international applicant from Lahore, Pakistan",
    source: "Welvaart careers",
    stage: "Applied",
    appliedOn: "2026-10-11",
    link: "https://halike.welvaart.io/careers/7/",
    nextAction: "Watch for Welvaart's stated response within 48 business hours",
    due: "2026-10-14",
    notes: "Applied through Welvaart's careers form with the latest live-app CV, Pakistan phone number, LinkedIn profile, and international location. The role lists 7+ years of frontend experience; the submitted CV accurately states three years.",
    activity: [{ date: "Oct 11", text: "Application submitted" }]
  },
  {
    id: "micro1-senior-mobile-developer",
    company: "micro1",
    role: "Senior Mobile Developer",
    location: "Remote · contractor",
    source: "micro1 careers",
    stage: "Interview",
    appliedOn: "2026-10-11",
    compensation: "USD 25/hour entered",
    link: "https://jobs.micro1.ai/post/31dc936e-0f29-441f-baf9-91c2ff9cc7d4",
    nextAction: "Complete the AI interview by Oct 13, 2026, 4:44 AM",
    due: "2026-10-13",
    notes: "Application submitted with the latest CV and GitHub portfolio. micro1 invited Huzaifa to an AI interview covering mobile-development experience, a core mobile language, testing, and debugging complex mobile applications.",
    activity: [
      { date: "Oct 11", text: "Application submitted" },
      { date: "Oct 11", text: "AI interview invitation received" }
    ]
  },
  {
    id: "writesonic",
    company: "Writesonic",
    role: "Senior Software Engineer (Frontend)",
    location: "Remote, India",
    source: "Workable",
    stage: "Applied",
    appliedOn: "2026-09-23",
    compensation: "Current USD 800/month; Expected USD 1,000 to 1,500/month",
    link: "https://jobs.workable.com/view/vkTUY2ArmfYXDGad7UUumc/remote-senior-software-engineer-(-frontend)-in-india-at-writesonic",
    nextAction: "Watch for an acknowledgement; clarify Pakistan remote-work eligibility if asked",
    due: "2026-10-07",
    notes: "Submitted through Workable with the provided CV, tailored frontend examples, and CTC range.",
    activity: [{ date: "Sep 23", text: "Application submitted" }]
  },
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
  },
  {
    id: "codenzy",
    company: "Codenzy",
    role: "React Developer (TypeScript)",
    location: "Lahore, Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Follow up if there is no response after 7–10 days",
    due: "2026-10-11",
    contact: "hr@codenzy.com",
    link: "https://www.linkedin.com/jobs/view/4433637238/",
    notes: "Tailored React and Next.js application emailed with CV attached and clickable GitHub and LinkedIn profile links.",
    activity: [{ date: "Oct 1", text: "Application email sent" }]
  },
  {
    id: "corvids-lab",
    company: "Corvids Lab",
    role: "Frontend Developer (React / Next.js)",
    location: "Lahore, Pakistan · Remote-friendly",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Follow up if there is no response after 7–10 days",
    due: "2026-10-11",
    contact: "careers@corvidslab.com",
    link: "https://corvidslab.com/career/",
    notes: "Tailored frontend application emailed with CV attached and clickable GitHub and LinkedIn profile links.",
    activity: [{ date: "Oct 1", text: "Application email sent" }]
  },
  {
    id: "carenexon",
    company: "Carenexon",
    role: "Frontend Developer",
    location: "Lahore, Pakistan",
    source: "Company careers form",
    stage: "Closed",
    appliedOn: "2026-10-01",
    nextAction: "Revisit only if the employer repairs its careers form",
    link: "https://www.carenexon.com/careers/apply?position=Frontend%20Developer",
    notes: "The completed form returned “Failed to send email. Please try again.” No application was sent.",
    activity: [{ date: "Oct 1", text: "Application blocked by company form error" }]
  },
  {
    id: "qto-dev",
    company: "QTO Dev",
    role: "Senior Frontend Engineer",
    location: "Pakistan · Remote-friendly",
    source: "Company careers page",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Watch for an acknowledgement or recruiter reply",
    due: "2026-10-08",
    link: "https://qtodev.com/careers",
    notes: "Submitted directly for the React, Next.js, TypeScript and Tailwind-focused role.",
    activity: [{ date: "Oct 1", text: "Application submitted" }]
  },
  {
    id: "trendbricks",
    company: "TrendBricks",
    role: "Frontend Engineer",
    location: "Islamabad / Remote",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Follow up if there is no response after 7–10 days",
    due: "2026-10-11",
    contact: "mawais31@gmail.com",
    link: "https://www.trendbricks.com/careers.html",
    notes: "Tailored application email sent with CV attached and clickable GitHub and LinkedIn profile links.",
    activity: [{ date: "Oct 1", text: "Application email sent" }]
  },
  {
    id: "wedx",
    company: "WedX",
    role: "Frontend Developer",
    location: "Remote / Karachi, Pakistan",
    source: "Company careers page",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Watch for an acknowledgement or recruiter reply",
    due: "2026-10-08",
    link: "https://wedx.pk/careers",
    notes: "Submitted through WedX's Tech recruitment form using the React, Next.js, Tailwind and frontend experience profile.",
    activity: [{ date: "Oct 1", text: "Application submitted" }]
  },
  {
    id: "tbox-solutionz",
    company: "TBox Solutionz",
    role: "Mobile Engineer (React Native)",
    location: "Remote / Lahore, Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Watch for their stated 48-hour response window",
    due: "2026-10-03",
    contact: "careers@tboxsolutionz.com",
    link: "https://tboxsolutionz.com/careers.html",
    notes: "Tailored Mobile Engineer application emailed with CV, GitHub profile and LinkedIn profile links.",
    activity: [{ date: "Oct 1", text: "Application email sent" }]
  },
  {
    id: "wordbitx",
    company: "WordbitX",
    role: "Next.js / React Engineer",
    location: "Lahore, Pakistan · Remote inside Pakistan",
    source: "Company careers page",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Watch for their stated one-business-day response window",
    due: "2026-10-02",
    contact: "info@wordbitxtech.com / WhatsApp",
    link: "https://www.wordbitxtech.com/contact?intent=job&role=nextjs-engineer",
    notes: "Submitted via the job form with GitHub profile and immediate availability, then followed up through the company WhatsApp channel.",
    activity: [{ date: "Oct 1", text: "Application submitted and WhatsApp follow-up sent" }]
  },
  {
    id: "grayphite",
    company: "Grayphite",
    role: "React Native Developer",
    location: "Johar Town, Lahore, Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-01",
    nextAction: "Watch for an acknowledgement or recruiter reply",
    due: "2026-10-08",
    contact: "careers@grayphite.com",
    notes: "Tailored React Native application emailed with CV, GitHub profile, LinkedIn profile, and immediate availability.",
    activity: [{ date: "Oct 1", text: "Application email sent" }]
  },
  {
    id: "newry-global",
    company: "Newry Global",
    role: "General application · Creative Technologist interest",
    location: "Remote-friendly",
    source: "Company careers page",
    stage: "Applied",
    appliedOn: "2026-10-06",
    nextAction: "Wait for a reply from the Newry team",
    due: "2026-10-13",
    link: "https://newryglobal.com/careers",
    notes: "Submitted through Newry's Join route. The note highlighted React, Next.js, React Native, automation workflows, Repo-cards, and the GitHub profile.",
    activity: [{ date: "Oct 6", text: "General application message sent" }]
  },
  {
    id: "semexsoft",
    company: "Semexsoft",
    role: "Frontend Developer · Next.js",
    location: "Remote · Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-06",
    compensation: "Previous USD 800/month; Expected PKR 280,000 to 420,000/month",
    nextAction: "Follow up if there is no response after 7–10 days",
    due: "2026-10-13",
    contact: "careers@semexsoft.com",
    link: "https://pk.linkedin.com/jobs/view/frontend-developer-next-js-%2B-ai-native-at-semexsoft-4461865043",
    notes: "Tailored Next.js and AI-assisted-development application emailed with CV attached and embedded Repo-cards and GitHub profile links.",
    activity: [{ date: "Oct 6", text: "Application email sent" }]
  },
  {
    id: "digixvalley",
    company: "Digixvalley",
    role: "Associate Frontend React Developer",
    location: "Lahore, Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-06",
    nextAction: "Follow up if there is no response after 7–10 days",
    due: "2026-10-16",
    contact: "info@digixvalley.com",
    link: "https://digixvalley.com/careers/",
    notes: "Tailored React application emailed with the CV attached and an embedded GitHub profile link.",
    activity: [{ date: "Oct 6", text: "Application email sent" }]
  },
  {
    id: "ignisynclab",
    company: "Ignisync Lab",
    role: "Frontend Developer · Contract",
    location: "Remote",
    source: "Direct email + recruiter message",
    stage: "Applied",
    appliedOn: "2026-10-06",
    compensation: "N400,000 fixed, milestone based contract · N30,000 paid assessment",
    nextAction: "Wait for shortlist or paid assessment details",
    due: "2026-10-13",
    contact: "contact@ignisynclab.com",
    link: "https://www.linkedin.com/company/ignisynclab/",
    notes: "Tailored contract application sent with CV, embedded GitHub link, immediate availability, and a design-system-first approach to the supplied Figma work. Ali Imran, the recruiter who shared the opening, was also messaged on LinkedIn.",
    activity: [{ date: "Oct 6", text: "Application email and recruiter message sent" }]
  },
  {
    id: "intellicore-tech",
    company: "IntelliCore Tech",
    role: "Front End Engineer",
    location: "Lahore, Pakistan · Hybrid",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-06",
    compensation: "USD 700 to 1,000 per month",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-13",
    contact: "hiring@intellicore.tech",
    link: "https://intellicore.tech/careers",
    notes: "Honest tailored application emailed with CV, embedded GitHub profile link, immediate availability, EST schedule flexibility, three years of production frontend and mobile experience, and automated browser testing experience with Playwright and Puppeteer.",
    activity: [{ date: "Oct 6", text: "Application email sent" }]
  },
  {
    id: "codeit-devs",
    company: "CodeIT Devs",
    role: "Frontend Developer",
    location: "Remote · Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-07",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-14",
    contact: "info@codeitdevs.com",
    link: "https://www.codeitdevs.com/",
    notes: "Tailored application emailed with the CV attached and an embedded GitHub profile link. It highlighted React, Next.js, React Native, SaaS dashboards, API integrations, realtime features, and AI-assisted development workflows.",
    activity: [{ date: "Oct 7", text: "Application email sent" }]
  },
  {
    id: "devmine",
    company: "Devmine",
    role: "Front End Developer",
    location: "Garden Town, Lahore, Pakistan · Onsite",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-07",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-14",
    contact: "talent@devmine.co",
    link: "https://pk.linkedin.com/company/devmine",
    notes: "Tailored application emailed with the CV attached and an embedded GitHub profile link. It focused on React, Next.js, React Native, responsive SaaS dashboards, API integrations, realtime features, and maintainable state management.",
    activity: [{ date: "Oct 7", text: "Application email sent" }]
  },
  {
    id: "goodtogo-frontend",
    company: "Good To Go",
    role: "Frontend Developer",
    location: "DHA Phase 6, Lahore, Pakistan · Onsite",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-07",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-14",
    contact: "fahad.goodtogo@gmail.com",
    link: "https://www.linkedin.com/posts/asimahmood_hiring-frontenddeveloper-reactjs-activity-7501634395859025921-xsem",
    notes: "Tailored application emailed with the CV attached and embedded GitHub and LinkedIn profile links. It highlighted three years of React, Next.js, JavaScript, TypeScript and React Native delivery, including SaaS dashboards, APIs, realtime features and map-based workflows.",
    activity: [{ date: "Oct 7", text: "Application email sent" }]
  },
  {
    id: "entropy-and-co",
    company: "Entropy And Co",
    role: "Senior Frontend Developer",
    location: "Lahore, Pakistan · Onsite",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-07",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-14",
    contact: "hassan@entropyand.co",
    link: "https://www.linkedin.com/in/shaheerkhawaja/",
    notes: "Tailored application emailed with the CV attached and an embedded GitHub profile link. It focused on three years of React, Next.js, JavaScript, TypeScript and React Native delivery, production SaaS work, AI assisted development workflows, and ownership through release.",
    activity: [{ date: "Oct 7", text: "Application email sent" }]
  },
  {
    id: "siliconnexus",
    company: "SiliconNexus",
    role: "Frontend Developer (React.js + Next.js)",
    location: "Lahore, Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-07",
    nextAction: "Fill their Frontend pre-screener form, then reply ACK in the Oct 7 thread (they asked for this after each application)",
    due: "2026-11-16",
    contact: "careers@silicon-nexus.com",
    link: "https://pk.linkedin.com/jobs/view/frontend-react-js-%2B-next-js-developer-at-siliconnexus-4455863391",
    notes: "Tailored application emailed with the CV attached and embedded GitHub and LinkedIn profile links. It matched React, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, Context API, TanStack Query, and API integration experience to the role.",
    activity: [
      { date: "Oct 7", text: "Application email sent" },
      { date: "Oct 7", text: "HR replied the same day with a pre-screening form and asked for an ACK reply" },
      { date: "Nov 14", text: "New hiring post seen (Frontend and React Native roles); the pre-screener is still not filled" }
    ]
  },
  {
    id: "eco-green-developers",
    company: "Eco Green Developers",
    role: "React/Next.js Frontend Developer",
    location: "Lahore, Pakistan",
    source: "Company careers form",
    stage: "Closed",
    appliedOn: "2026-10-07",
    nextAction: "Revisit only if the employer repairs the application form",
    link: "https://eco-greendevelopers.com/careers/application-form",
    notes: "The application was completed with the CV, GitHub profile and tailored note, but the form returned “Origin is not allowed.” No application was submitted.",
    activity: [{ date: "Oct 7", text: "Application blocked by company form error" }]
  },
  {
    id: "xws-solution",
    company: "XWS Solution",
    role: "Frontend Developer",
    location: "Remote · Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-10-07",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-14",
    contact: "mnaveed2862@gmail.com",
    link: "https://xws.digital/career",
    notes: "Tailored remote application emailed with the CV attached and embedded GitHub and LinkedIn profile links. It matched React, Next.js, TypeScript, Tailwind CSS, state management, mobile delivery and AI-assisted development workflows to the role.",
    activity: [{ date: "Oct 7", text: "Application email sent" }]
  },
  {
    id: "parallax-labs",
    company: "Parallax Labs",
    role: "Frontend Developer",
    location: "Remote · project-based",
    source: "Company careers form",
    stage: "Applied",
    appliedOn: "2026-10-10",
    compensation: "USD 1,000 to 1,500 per month",
    nextAction: "Wait for an acknowledgement or interview invitation",
    due: "2026-10-17",
    contact: "careers@parallaxlab.site",
    link: "https://www.parallaxlab.site/careers",
    notes: "Submitted through the company careers form for the Frontend Developer opening with the CV attached, Lahore location, LinkedIn profile, and the stated salary range.",
    activity: [{ date: "Oct 10", text: "Application submitted" }]
  },
  {
    id: "devsinc-frontend",
    company: "Devsinc",
    role: "Software Engineer – Frontend",
    location: "Lahore, Pakistan",
    source: "Workable careers page",
    stage: "Applied",
    appliedOn: "2026-11-11",
    link: "https://apply.workable.com/devsinc-17/j/2A641AD47B/apply/",
    nextAction: "Wait for a reply from the hiring team",
    due: "2026-11-18",
    notes: "Submitted in Chrome with the Software Engineer CV; Workable sent a 'Thanks for applying' email the same evening.",
    activity: [
      {
        date: "Nov 11",
        text: "Application submitted; Workable confirmation email received"
      }
    ]
  },
  {
    id: "devsinc-nodejs",
    company: "Devsinc",
    role: "Senior Software Engineer – Node.js",
    location: "Lahore, Pakistan",
    source: "Workable careers page",
    stage: "Applied",
    appliedOn: "2026-11-11",
    link: "https://apply.workable.com/devsinc-17/j/20520C8A7E/apply/",
    nextAction: "Wait for a reply from the hiring team",
    due: "2026-11-18",
    notes: "Submitted in Chrome with the Software Engineer CV; Workable sent a 'Thanks for applying' email the same evening.",
    activity: [
      {
        date: "Nov 11",
        text: "Application submitted; Workable confirmation email received"
      }
    ]
  },
  {
    id: "creative-chaos-react-native",
    company: "Creative Chaos",
    role: "Software Engineer – React Native",
    location: "Remote · Pakistan",
    source: "Workable careers page",
    stage: "Applied",
    appliedOn: "2026-11-11",
    link: "https://apply.workable.com/creativechaos/j/B08909851F/apply/",
    nextAction: "Wait for a reply from the hiring team",
    due: "2026-11-18",
    notes: "Submitted in Chrome with the Software Engineer CV; Workable sent a 'Thanks for applying' email the same evening.",
    activity: [
      {
        date: "Nov 11",
        text: "Application submitted; Workable confirmation email received"
      }
    ]
  },
  {
    id: "pavago-ai-automation-specialist",
    company: "Pavago",
    role: "AI Automation Specialist",
    location: "Remote · Pakistan · US hours",
    source: "Workable careers page",
    stage: "Applied",
    appliedOn: "2026-11-11",
    link: "https://apply.workable.com/pavago/j/0451C10630/apply/",
    nextAction: "Wait for a reply from the hiring team",
    due: "2026-11-18",
    notes: "Submitted in Chrome with the Software Engineer CV; Workable sent a 'Thanks for applying' email the same evening.",
    activity: [
      {
        date: "Nov 11",
        text: "Application submitted; Workable confirmation email received"
      }
    ]
  },
  {
    id: "pavago-ai-engineer",
    company: "Pavago",
    role: "AI Engineer",
    location: "Remote · Pakistan · US hours",
    source: "Workable careers page",
    stage: "Applied",
    appliedOn: "2026-11-11",
    link: "https://apply.workable.com/pavago/j/4ABDEC0BF1/apply/",
    nextAction: "Wait for a reply from the hiring team",
    due: "2026-11-18",
    notes: "Submitted in Chrome with the Software Engineer CV; Workable sent a 'Thanks for applying' email the same evening.",
    activity: [
      {
        date: "Nov 11",
        text: "Application submitted; Workable confirmation email received"
      }
    ]
  },
  {
    id: "proskillshr-app-developer-ai-automation",
    company: "PROSkillsHR (for a mental-health client)",
    role: "App Developer & AI Automation Specialist",
    location: "Remote · international client",
    source: "Recruiter post · direct email",
    stage: "Applied",
    appliedOn: "2026-11-11",
    nextAction: "Wait for the paid task or a call",
    due: "2026-11-18",
    contact: "careers@proskillshr.com",
    notes: "Tailored email sent from Gmail with the Software Engineer CV attached, covering Hopn React Native apps, Boolmind AI SaaS and agents, n8n and LLM APIs, and privacy-first handling of personal data.",
    activity: [
      {
        date: "Nov 11",
        text: "Application email sent with CV"
      }
    ]
  },
  {
    id: "awisee-frontend-nextjs",
    company: "AWISEE",
    role: "Frontend Developer (Next.js)",
    location: "Remote",
    source: "X post · Zoho Recruit form",
    stage: "Applied",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month entered",
    nextAction: "Wait for a reply",
    due: "2026-11-19",
    notes: "Zoho application filled with the Software Engineer CV and LinkedIn; Huzaifa completed the CAPTCHA and submitted it himself.",
    activity: [
      {
        date: "Nov 12",
        text: "Application submitted"
      }
    ]
  },
  {
    id: "brilliant-boss-full-stack-riyadh",
    company: "Brilliant Boss HR Consultancy",
    role: "Full Stack Developer (Laravel, NestJS, Next.js)",
    location: "Riyadh, Saudi Arabia · relocation",
    source: "Recruiter post · direct email",
    stage: "Awaiting reply",
    appliedOn: "2026-11-12",
    compensation: "SAR 4,000–6,000/month (their range)",
    nextAction: "Proceed only if the employer pays the recruitment fee; otherwise drop it",
    due: "2026-11-19",
    contact: "marketing.bbhrc@gmail.com",
    notes: "Applied by email with the Software Engineer CV, honest about 3.5 years and limited Laravel. The agency replied asking for a recruitment service charge of one month's gross salary paid by the candidate; the reply answered every question, said 'can consider SAR 4,000–6,000', asked what the package covers, and declined the fee (Saudi law puts recruitment costs on the employer).",
    activity: [
      {
        date: "Nov 12",
        text: "Reply sent declining the candidate-paid recruitment fee"
      },
      {
        date: "Nov 12",
        text: "Agency asked for a one-month-salary service charge"
      },
      {
        date: "Nov 12",
        text: "Application email sent with CV"
      }
    ]
  },
  {
    id: "anushay-meer-part-time-developer",
    company: "Anushay Meer (hiring post)",
    role: "Part-Time Developer (project-based, remote)",
    location: "Remote",
    source: "LinkedIn post · direct email",
    stage: "Applied",
    appliedOn: "2026-11-12",
    nextAction: "Send the LinkedIn DM if not done yet; wait for a reply",
    due: "2026-11-19",
    contact: "anushaymeer99@gmail.com",
    notes: "Emailed with the Software Engineer CV and portfolio links. The post listed a 'gamil.com' address (a look-alike domain that accepts mail), so the email went to the gmail.com address with a P.S. explaining why.",
    activity: [
      {
        date: "Nov 12",
        text: "Application email sent with CV"
      }
    ]
  },
  {
    id: "derby-digital-product-designer-react",
    company: "Derby Digital",
    role: "Product Designer / React Developer (DerbyFlow)",
    location: "Remote · Pakistan",
    source: "LinkedIn post · direct email",
    stage: "Applied",
    appliedOn: "2026-11-12",
    nextAction: "Prepare for the trial task (React booking or guest-list screen)",
    due: "2026-11-19",
    contact: "jahan@derbydigital.us",
    notes: "Emailed with the Software Engineer CV: Brokr bookings, Boolmind AI SaaS, Hopn apps, small-business client work, AI-assisted workflow (Claude Code, repocards).",
    activity: [
      {
        date: "Nov 12",
        text: "Application email sent with CV"
      }
    ]
  },
  {
    id: "wizdaa-senior-react-native-react-pk",
    company: "Wizdaa",
    role: "Senior React Native & React Engineer PK",
    location: "Remote · Pakistan",
    source: "Recruitee careers page",
    stage: "Applied",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month entered",
    link: "https://wizdaa.recruitee.com/o/senior-react-native-react-engineer-pk-1",
    nextAction: "Wait for a reply",
    due: "2026-11-19",
    notes: "Answered honestly: 3.5 years total, React Native about 1 year, React 3 years, no GraphQL or TDD.",
    activity: [
      {
        date: "Nov 12",
        text: "Application submitted with the Software Engineer CV"
      }
    ]
  },
  {
    id: "remotepeople-full-stack-apac",
    company: "Remote People",
    role: "Full Stack Engineer (APAC)",
    location: "Remote · APAC",
    source: "Greenhouse (found via FrontendEngineers.com)",
    stage: "Applied",
    appliedOn: "2026-11-12",
    compensation: "RMB 130,000/year entered (about USD 18,000)",
    link: "https://job-boards.eu.greenhouse.io/remotepeople/jobs/5011829101",
    nextAction: "Wait for a reply",
    due: "2026-11-19",
    notes: "CV pasted as text because the file upload failed. Stated Python about 1 year for scripting and no Java.",
    activity: [
      {
        date: "Nov 12",
        text: "Application submitted with the Software Engineer CV"
      }
    ]
  },
  {
    id: "startale-senior-frontend",
    company: "Startale",
    role: "Senior Frontend Engineer",
    location: "Remote · Asia",
    source: "Greenhouse (found via FrontendEngineers.com)",
    stage: "Applied",
    appliedOn: "2026-11-12",
    compensation: "USD 18,000/year entered (negotiable)",
    link: "https://job-boards.greenhouse.io/startale/jobs/5026706008",
    nextAction: "Wait for a reply",
    due: "2026-11-19",
    notes: "CV pasted as text. Noted no web3 experience yet; 3 years + selected.",
    activity: [
      {
        date: "Nov 12",
        text: "Application submitted with the Software Engineer CV"
      }
    ]
  },
  {
    id: "quirkybit-frontend-react",
    company: "QuirkyBit",
    role: "Frontend Developer (React)",
    location: "Lahore, Pakistan",
    source: "QuirkyBit careers form (found via FrontendEngineers.com)",
    stage: "Applied",
    appliedOn: "2026-11-12",
    link: "https://www.quirkybit.io/careers/apply?id=frontend-developer-react",
    nextAction: "Wait for a reply",
    due: "2026-11-19",
    notes: "Cover letter honest about no D3 or WebGL depth; CV attached.",
    activity: [
      {
        date: "Nov 12",
        text: "Application submitted with the Software Engineer CV"
      }
    ]
  },
  {
    id: "mintlayer-frontend-mws-console",
    company: "Mintlayer",
    role: "Frontend Engineer (React/TS) – MWS Console",
    location: "Remote or Abu Dhabi",
    source: "Mintlayer careers form (found via FrontendEngineers.com)",
    stage: "Applied",
    appliedOn: "2026-11-12",
    link: "https://www.mintlayer.com/career/frontend-engineer-react-ts---mws-console/",
    nextAction: "Wait for a reply",
    due: "2026-11-19",
    notes: "Stated 3.5 years against their 4+ and no web3 yet. They reply within 2–3 weeks.",
    activity: [
      {
        date: "Nov 12",
        text: "Application submitted with the Software Engineer CV"
      }
    ]
  },
  {
    id: "huzzle-frontend-engineer",
    company: "Huzzle",
    role: "Frontend Engineer",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/huzzle/j/0FEAC9B744/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "huzzle-full-stack-developer",
    company: "Huzzle",
    role: "Full-stack Developer",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/huzzle/j/CD16BBB82C/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "huzzle-full-stack-python-react-ai",
    company: "Huzzle",
    role: "Full-Stack Developer (Python, React, AI)",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 420,000/month (planned)",
    link: "https://apply.workable.com/huzzle/j/E950529CC8/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "pavago-full-stack-nextjs-python",
    company: "Pavago",
    role: "Full-Stack Developer – Next.js & Python",
    location: "Remote · Pakistan · US hours",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/pavago/j/A2AE27B5CA/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "pavago-ai-product-engineer",
    company: "Pavago",
    role: "AI Product Engineer (Full Stack)",
    location: "Remote · Pakistan · US hours",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/pavago/j/F280D10F6F/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "pavago-full-stack-developer-app-router",
    company: "Pavago",
    role: "Full-Stack Developer (Next.js App Router, Postgres)",
    location: "Remote · Pakistan · US hours",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/pavago/j/3DDACF04AF/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "creative-chaos-senior-react",
    company: "Creative Chaos",
    role: "Senior Software Engineer – React",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 250,000/month (planned)",
    link: "https://apply.workable.com/creativechaos/j/AAD5AB52B8/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "creative-chaos-full-stack-developer",
    company: "Creative Chaos",
    role: "Full Stack Developer",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 250,000/month (planned)",
    link: "https://apply.workable.com/creativechaos/j/2D0FAD9D9A/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "creative-chaos-senior-node-react",
    company: "Creative Chaos",
    role: "Senior Software Engineer – Node + React",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 250,000/month (planned)",
    link: "https://apply.workable.com/creativechaos/j/7398AAB742/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "creative-chaos-software-engineer-react",
    company: "Creative Chaos",
    role: "Software Engineer – React",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 250,000/month (planned)",
    link: "https://apply.workable.com/creativechaos/j/D3FF3CD9DB/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "creative-chaos-full-stack-node-python-react",
    company: "Creative Chaos",
    role: "Full Stack Engineer (Node/Python and React)",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 250,000/month (planned)",
    link: "https://apply.workable.com/creativechaos/j/5CFC3C7A9D/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "creative-chaos-full-stack-python-react",
    company: "Creative Chaos",
    role: "Full Stack Engineer – Python + React",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "PKR 250,000/month (planned)",
    link: "https://apply.workable.com/creativechaos/j/CF255B7989/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "pavago-full-stack-ai-developer",
    company: "Pavago",
    role: "Full Stack AI Developer",
    location: "Remote · Pakistan · US hours",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/pavago/j/4E1D88E8BB/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "pavago-full-stack-developer-ai-assistant",
    company: "Pavago",
    role: "Full-Stack Developer (AI assistant for home-service businesses)",
    location: "Remote · Pakistan · US hours",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/pavago/j/B27DE28C51/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "pavago-senior-full-stack-developer",
    company: "Pavago",
    role: "Senior Full Stack Developer (React, Node.js, TypeScript)",
    location: "Remote · Pakistan · US hours",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 1,500/month (planned)",
    link: "https://apply.workable.com/pavago/j/06FB8DFD7B/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "motive-general-application-pakistan",
    company: "Motive",
    role: "General application – Engineering (Remote, Pakistan)",
    location: "Remote · Pakistan",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    link: "https://job-boards.greenhouse.io/gomotive/jobs/5476318002",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "Answers prepared from the CV; submit in Chrome because the in-app browser cannot pass Workable's Cloudflare check.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "tether-frontend-software-engineer",
    company: "Tether",
    role: "Frontend Software Engineer (100% remote, worldwide)",
    location: "Remote · worldwide",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 18,000/year (planned)",
    link: "https://tether.recruitee.com/o/frontend-software-engineer-100-remote-worldwide/c/new",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "The form forbids AI-written answers, so the essay questions must be written by Huzaifa himself; the factual fields are prepared.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "tether-frontend-desktop-engineer",
    company: "Tether",
    role: "Frontend Desktop Engineer (100% remote, worldwide)",
    location: "Remote · worldwide",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 18,000/year (planned)",
    link: "https://tether.recruitee.com/o/frontend-desktop-engineer-100-remote-worldwide/c/new",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "The form forbids AI-written answers, so the essay questions must be written by Huzaifa himself; the factual fields are prepared.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "tether-mobile-engineer-react-native",
    company: "Tether",
    role: "Mobile Engineer – React Native (100% remote, worldwide)",
    location: "Remote · worldwide",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    compensation: "USD 18,000/year (planned)",
    link: "https://tether.recruitee.com/o/mobile-engineer-react-native-100-remote-worldwide/c/new",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "The form forbids AI-written answers, so the essay questions must be written by Huzaifa himself; the factual fields are prepared.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "canonical-web-frontend-engineer",
    company: "Canonical",
    role: "Web Frontend Engineer – JS, CSS, React, Flutter",
    location: "Remote · worldwide",
    source: "FrontendEngineers.com batch / company careers page",
    stage: "Draft",
    appliedOn: "2026-11-12",
    link: "https://job-boards.greenhouse.io/canonical/jobs/5150422",
    nextAction: "Submit in Chrome with the Software Engineer CV",
    due: "2026-11-13",
    notes: "The form forbids AI-written answers, so the essay questions must be written by Huzaifa himself; the factual fields are prepared.",
    activity: [
      {
        date: "Nov 12",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "riverhouse-technologies-mern-full-stack",
    company: "Riverhouse Technologies",
    role: "Full Stack Developer (MERN Stack)",
    location: "Not stated in the post",
    source: "LinkedIn post · direct email",
    stage: "Applied",
    appliedOn: "2026-11-13",
    nextAction: "Wait for a reply from Riverhouse HR",
    due: "2026-11-20",
    contact: "hr@riverhousetechnologies.com",
    notes: "AI product development and MVP studio. Emailed with the Software Engineer CV attached: React front ends of 2 production AI SaaS platforms, Node.js REST APIs and MongoDB data models at Boolmind, scheduled AI agents and LLM integration, Hopn React Native apps, Upwork Top Rated. 3.5 years against their 3–5. No bounce.",
    activity: [
      {
        date: "Nov 13",
        text: "Application email sent with CV"
      }
    ]
  },
  {
    id: "lucidya-10x-software-engineer",
    company: "Lucidya",
    role: "10x Software Engineer",
    location: "On-site · Riyadh, Saudi Arabia · relocation",
    source: "LinkedIn post · Workable",
    stage: "Draft",
    appliedOn: "2026-11-13",
    link: "https://apply.workable.com/lucidya/j/5294DA8CF4/apply/",
    nextAction: "Submit in Chrome with the Software Engineer CV and the prepared answers",
    due: "2026-11-14",
    notes: "AI-powered customer experience platform (pre-IPO). Backend-heavy role: Ruby on Rails, Python, PostgreSQL, Elasticsearch, RabbitMQ, Kubernetes. A stretch for a TypeScript/React/Node profile; answers say so honestly. Lucidya's other roles (DevOps, Senior DevOps, DBA, AI Tech Lead) do not fit. The Kopius MATLAB role from the same day was skipped: Latin America only, 10+ years, MATLAB.",
    activity: [
      {
        date: "Nov 13",
        text: "Answers prepared; ready to submit"
      }
    ]
  },
  {
    id: "solulab-react-native-shopify",
    company: "Solulab",
    role: "React Native Developer (Shopify & Mobile Commerce)",
    location: "Remote · 3 PM–12 AM IST (2:30–11:30 PM PKT)",
    source: "LinkedIn post · direct email",
    stage: "Applied",
    appliedOn: "2026-11-13",
    nextAction: "Wait for a reply; read up on the Shopify Storefront API and Checkout Kit before any call",
    due: "2026-11-20",
    contact: "aditii@solulab.co",
    notes: "Emailed with the updated Software Engineer CV (with Claude 101): Hopn React Native apps with Android and iOS builds and releases in 4 months, LenaDena (Expo), Boolmind AI SaaS front ends. Said honestly that he hasn't integrated Shopify APIs yet. 3.5 years against their 2–5. No bounce.",
    activity: [
      {
        date: "Nov 13",
        text: "Application email sent with CV"
      }
    ]
  },
  {
    id: "nessovo-agentic-ai-mobile-application",
    company: "Nessovo Technologies",
    role: "Agentic AI Mobile App Developer (React Native / Expo)",
    location: "Lahore (Johar Town) · on-site",
    source: "LinkedIn company post · direct email (daily scan)",
    stage: "Applied",
    appliedOn: "2026-11-13",
    link: "https://www.linkedin.com/company/nessovo-technologies/",
    nextAction: "Wait for a reply; be ready to show LenaDena and talk about AI agents",
    due: "2026-11-20",
    contact: "hr@nessovo.com",
    notes: "CV tailored to React Native + AI: Hopn apps on both stores in 4 months, Boolmind scheduled AI agents and LLM integration, LenaDena (Expo + Fastify + Supabase), Claude Code and Claude 101. Their post also wants EAS Build/Submit and streaming chat UIs, which the CV does not claim. Sent with GitHub, LenaDena and repocards links.",
    activity: [
      {
        date: "Nov 13",
        text: "Email sent with a CV tailored to the role"
      }
    ]
  },
  {
    id: "innovex-ai-junior-full-stack-application",
    company: "Innovex AI",
    role: "Junior Full-Stack Developer (React, Next.js, TypeScript, Node.js, Supabase)",
    location: "UAE company · asked whether remote is possible",
    source: "LinkedIn post · direct email (daily scan)",
    stage: "Applied",
    appliedOn: "2026-11-13",
    nextAction: "Wait for a reply on remote eligibility",
    due: "2026-11-20",
    notes: "CV tailored to Next.js + Supabase full-stack work: the Upwork resume-tailoring app (Next.js, TypeScript, Supabase) and the costing app (Next.js, Node.js, PostgreSQL), LenaDena, 2 production AI SaaS platforms. Framed 3.5 years as owning features from day one.",
    activity: [
      {
        date: "Nov 13",
        text: "Email sent with a CV tailored to the role"
      }
    ]
  },
  {
    id: "wondertree-react-native-application",
    company: "WonderTree",
    role: "React Native developer for their new mobile app (no posted role)",
    location: "Pakistan · asked about full-time or contract",
    source: "Funding news (GSMA Innovation Fund grant) · direct email (daily scan)",
    stage: "Applied",
    appliedOn: "2026-11-13",
    link: "https://insideai.news/news/ai-in-business/gsma-innovation-fund-for-impactful-ai/15152/",
    nextAction: "Wait for a reply; offered a 15-minute call this week",
    due: "2026-11-20",
    contact: "hello@wondertree.co",
    notes: "Speculative email after their GSMA Innovation Fund for Impactful AI grant, which funds a mobile app for their AR therapy games. CV tailored to shipping React Native apps (Hopn: both stores in 4 months).",
    activity: [
      {
        date: "Nov 13",
        text: "Email sent with a CV tailored to the role"
      }
    ]
  },
  {
    id: "icosynth-fullstack-application",
    company: "Icosynth",
    role: "Fullstack Developer (4-day work week)",
    location: "Sri Lanka · asked whether remote from Lahore is possible",
    source: "LinkedIn company post · direct email (daily scan)",
    stage: "Applied",
    appliedOn: "2026-11-13",
    link: "https://www.linkedin.com/company/icosynth/",
    nextAction: "Wait for a reply on remote eligibility",
    due: "2026-11-20",
    contact: "hireme@icosynth.com",
    notes: "CV tailored to full-stack + AI and automation: Boolmind AI SaaS front ends and Node APIs, scheduled AI agents, LLM integrations, n8n, repocards (about 2,400 npm downloads), Upwork Top Rated.",
    activity: [
      {
        date: "Nov 13",
        text: "Email sent with a CV tailored to the role"
      }
    ]
  },
  {
    id: "laam-react-native-application",
    company: "LAAM",
    role: "Software Engineer – React Native",
    location: "Lahore (NASTP) · on-site",
    source: "LAAM careers (PeopleForce) · seed-funded startup",
    stage: "Applied",
    appliedOn: "2026-11-14",
    link: "https://laam.peopleforce.io/careers/v/124675-software-engineer-react-native",
    nextAction: "Wait for a reply",
    due: "2026-11-21",
    notes: "Seed-funded ($5.5M, Jul 2026). React Native CV. Cover letter honest: 3.5 years against their 4+, React Native and React rather than Vue/Nuxt so far.",
    activity: [
      {
        date: "Nov 14",
        text: "Application submitted with a CV tailored to the role"
      }
    ]
  },
  {
    id: "laam-frontend-application",
    company: "LAAM",
    role: "Software Engineer – Frontend",
    location: "Lahore (NASTP) · on-site",
    source: "LAAM careers (PeopleForce)",
    stage: "Draft",
    appliedOn: "2026-11-14",
    link: "https://laam.peopleforce.io/careers/v/137380-software-engineer-frontend",
    nextAction: "Fill the form yourself: the filled copy was lost when the browser restarted (gender is required; only Male/Female)",
    due: "2026-11-15",
    notes: "Everything else is filled with the Frontend CV: Lahore, GCU BS Computer Science 2023, 3 years (whole numbers only), Hopn / React Native Developer, PKR 200,000 current, PKR 250,000 expected, notice 0 days.",
    activity: [
      {
        date: "Nov 14",
        text: "Form filled; waiting for the gender choice"
      },
      {
        date: "Nov 14",
        text: "Filled form lost when the browser restarted; needs filling again"
      }
    ]
  },
  {
    id: "darkthorn-labs-software-engineer",
    company: "Darkthorn Labs",
    role: "Software Engineer (Node.js + React)",
    location: "Lahore · on-site",
    source: "LinkedIn Easy Apply",
    stage: "Applied",
    appliedOn: "2026-11-14",
    compensation: "PKR 250,000/month entered",
    link: "https://www.linkedin.com/jobs/view/4489003621/",
    nextAction: "Wait for a reply",
    due: "2026-11-21",
    notes: "Full-stack CV. Answers: Node.js 2 yrs, React 3, on-site yes, BS yes, expected 250,000 PKR, 8 months of hands-on AI agentic coding.",
    activity: [
      {
        date: "Nov 14",
        text: "Application submitted with a CV tailored to the role"
      }
    ]
  },
  {
    id: "smart-prop-firm-junior-software-engineer",
    company: "Smart Prop Firm",
    role: "Junior Software Engineer",
    location: "Pakistan · remote",
    source: "LinkedIn Easy Apply",
    stage: "Applied",
    appliedOn: "2026-11-14",
    link: "https://www.linkedin.com/jobs/view/4488549816/",
    nextAction: "Wait for a reply",
    due: "2026-11-21",
    notes: "Full-stack CV. Answers: software engineering practices 3 yrs, Next.js 3 yrs.",
    activity: [
      {
        date: "Nov 14",
        text: "Application submitted with a CV tailored to the role"
      }
    ]
  },
  {
    id: "rowanbridge-ai-automation-engineer",
    company: "The Rowanbridge Group",
    role: "AI Automation & No-Code Systems Engineer",
    location: "Remote (UK company, Pakistan eligible)",
    source: "LinkedIn Easy Apply",
    stage: "Applied",
    appliedOn: "2026-11-14",
    link: "https://www.linkedin.com/jobs/view/4488234095/",
    nextAction: "Wait for a reply; brush up on Make, Airtable/Softr and Twilio in case of a call",
    due: "2026-11-21",
    notes: "Builds lead-automation for UK car dealerships with Make/n8n, LLM email parsing and a dashboard. Full-stack CV; answered Yes to Make/n8n experience (n8n).",
    activity: [
      {
        date: "Nov 14",
        text: "Application submitted with a CV tailored to the role"
      }
    ]
  },
  {
    id: "remotefolio-ai-training-full-stack",
    company: "Remotefolio",
    role: "Sr. Full-Stack Software Engineer (AI training, part-time contract)",
    location: "Remote",
    source: "LinkedIn Easy Apply",
    stage: "Applied",
    appliedOn: "2026-11-14",
    compensation: "USD 50–100/hr (their range)",
    link: "https://www.linkedin.com/jobs/view/4488273567/",
    nextAction: "Finish the micro1 application yourself: form, 2 screening questions, then a 30-minute AI interview",
    due: "2026-11-16",
    notes: "Task-based AI-training gig at USD 50–100/hr, not a full-time job. Remotefolio is an aggregator; the real role is micro1's (paid per accepted task, weekly minimum of tasks). Pakistan is eligible.",
    activity: [
      {
        date: "Nov 14",
        text: "Application submitted with a CV tailored to the role"
      },
      {
        date: "Nov 14",
        text: "Remotefolio replied by DM: next step is micro1's application and AI interview"
      }
    ]
  },
  {
    id: "broadstone-full-stack-application",
    company: "Broadstone Technologies",
    role: "Software Engineer (Full Stack), freshers to 3 yrs",
    location: "Lahore · on-site",
    source: "LinkedIn post · Google Form",
    stage: "Draft",
    appliedOn: "2026-11-14",
    link: "https://forms.gle/8yjCJtJQvjH8bewc6",
    nextAction: "Fill the Google Form yourself (needs your CGPA and a CV upload from Drive)",
    due: "2026-11-15",
    notes: "Form: name, contact, email, position = Software Engineer (Full Stack), on-site Lahore yes, university, CGPA, city, graduating year 2023, experience 3-5 years, CV upload.",
    activity: [
      {
        date: "Nov 14",
        text: "Checked the form; needs CGPA and a Drive upload"
      }
    ]
  },
  {
    id: "businessmentor-ai-agents-full-stack",
    company: "BusinessMentor.com",
    role: "Senior Full-Stack Developer, AI Agents (React/TypeScript/Express/Puppeteer)",
    location: "Pakistan · remote",
    source: "LinkedIn Easy Apply",
    stage: "Draft",
    appliedOn: "2026-11-14",
    link: "https://www.linkedin.com/jobs/view/4482768100/",
    nextAction: "Apply only if all 4 conditions in the post are true for you (99% of coding with AI agents, scrapers, external dependencies, solo ownership)",
    due: "2026-11-15",
    notes: "Strong stack match (React, TypeScript, Express, Puppeteer, scrapers: your Crawlee scraper). Not submitted because the post asks applicants to self-certify conditions only you can confirm.",
    activity: [
      {
        date: "Nov 14",
        text: "Shortlisted; waiting for your decision"
      }
    ]
  },
  {
    id: "railway-senior-full-stack-product",
    company: "Railway",
    role: "Senior Full-Stack Engineer – Product",
    location: "Remote · worldwide",
    source: "Hacker News Who is Hiring (Nov 2026) · Ashby",
    stage: "Applied",
    appliedOn: "2026-11-14",
    link: "https://jobs.ashbyhq.com/Railway/6ddcfe47-6cce-469b-ba6d-4f0e83440c9d",
    nextAction: "Wait for a reply",
    due: "2026-11-28",
    notes: "Full-stack CV tailored to the role (TypeScript, Next.js, Node.js, real-time dashboards, repocards first). The 'Why Railway?' answer is honest: no Temporal, GraphQL or Rust in production yet, and 3.5 years for a senior role.",
    activity: [
      {
        date: "Nov 14",
        text: "Application submitted on Railway's Ashby form with a tailored CV"
      }
    ]
  },
  {
    id: "collabify-senior-full-stack-contract",
    company: "Collabify",
    role: "Senior Full-Stack Engineer (backend-heavy), 4–5 month contract",
    location: "Remote · worldwide",
    source: "Hacker News Who is Hiring (Nov 2026) · Google Form",
    stage: "Draft",
    appliedOn: "2026-11-14",
    link: "https://forms.gle/yJAabKvLKtJmfz21A",
    nextAction: "Fill the Google Form yourself if you have personally shipped a multi-tenant SaaS",
    due: "2026-11-16",
    notes: "First engineer; TypeScript, React/Next.js, Node.js, PostgreSQL; tenant isolation with row-level security, several sign-in flows, subdomain client portals, large video uploads. 20–30+ h/week, 3 h daily overlap. Process: short form, live walkthrough of something you built, a paid tenant-isolation exercise.",
    activity: [
      {
        date: "Nov 14",
        text: "Shortlisted; the form asks about your own multi-tenant work"
      }
    ]
  },
  {
    id: "tether-ai-harness-engineer",
    company: "Tether",
    role: "AI Harness Engineer",
    location: "Remote · worldwide",
    source: "Hacker News Who is Hiring (Oct 2026) · Tether careers",
    stage: "Draft",
    appliedOn: "2026-11-14",
    link: "https://tether.recruitee.com/o/ai-harness-engineer-100-remote-worldwide-4",
    nextAction: "Apply yourself in your own words (Tether does not accept AI-written answers)",
    due: "2026-11-17",
    notes: "JavaScript/TypeScript plus hands-on LLM work, agent harnesses, local inference or P2P. Your matches: repocards (a tool for AI coding assistants), AI-Video-Maker (local models on an M1), scheduled AI agents at Boolmind. Still published on Nov 14.",
    activity: [
      {
        date: "Nov 14",
        text: "Shortlisted from Hacker News; left for you to write"
      }
    ]
  },
  {
    id: "trustedtrucks-senior-frontend",
    company: "TrustedTrucks",
    role: "Senior Frontend Developer",
    location: "Remote · EU hours (10:00–19:00 CET)",
    source: "LinkedIn post · email",
    stage: "Applied",
    appliedOn: "2026-11-14",
    link: "https://trustedtrucks.com",
    nextAction: "Wait for a reply; a LinkedIn DM to the poster would help (their jobs@ inbox is full)",
    due: "2026-11-19",
    notes: "European freight network on Next.js. Frontend CV tailored to the role (dashboards, map tracking, frontend architecture, Lighthouse 82 to 100). Honest about 3.5 years for a senior role. Hours are 14:00–23:00 in Pakistan.",
    activity: [
      {
        date: "Nov 14",
        text: "Application emailed with a tailored CV"
      },
      {
        date: "Nov 14",
        text: "Bounced: their jobs@ mailbox is full, so it was not delivered"
      },
      {
        date: "Nov 14",
        text: "Resent to their support address with the same CV"
      }
    ]
  },
  {
    id: "decodex-react-developer-remote",
    company: "Decodex Technology & Consulting",
    role: "React.js Developer",
    location: "Remote",
    source: "LinkedIn post · email",
    stage: "Applied",
    appliedOn: "2026-11-14",
    nextAction: "Wait for a reply",
    due: "2026-11-21",
    notes: "React CV tailored to their list (Redux and Context API, REST and third-party integrations, responsive UI, debugging). The post asks for 6 years; the email says honestly that you have 3.5.",
    activity: [
      {
        date: "Nov 14",
        text: "Application emailed with a tailored CV"
      }
    ]
  },
  {
    id: "siliconnexus-react-native-developer",
    company: "SiliconNexus",
    role: "React Native Developer",
    location: "Lahore, Pakistan · on-site",
    source: "LinkedIn post · email",
    stage: "Applied",
    appliedOn: "2026-11-14",
    nextAction: "Watch for their pre-screener form; fill it and reply ACK",
    due: "2026-11-17",
    notes: "React Native CV tailored to the role (Hopn's two store-released apps first, LenaDena, Claude Code and repocards for their AI-native ask). Honest that React Native work started in Mar 2026, on top of 3.5 years of React. Separate from the earlier Frontend application.",
    activity: [
      {
        date: "Nov 14",
        text: "Application emailed with a tailored CV"
      }
    ]
  },
  {
    id: "crojungle-ai-developer",
    company: "CroJungle",
    role: "AI Developer",
    location: "Lahore, Pakistan",
    source: "Direct email",
    stage: "Applied",
    appliedOn: "2026-11-09",
    nextAction: "Wait for a reply",
    due: "2026-11-16",
    notes: "Emailed on Nov 9. Logged on Nov 14 when the Vibe Coding post came up again.",
    activity: [
      {
        date: "Nov 9",
        text: "Application email sent"
      }
    ]
  },
  {
    id: "crojungle-vibe-coding-developer",
    company: "CroJungle",
    role: "Vibe Coding Developer",
    location: "Johar Town, Lahore · on-site",
    source: "LinkedIn post · email",
    stage: "Applied",
    appliedOn: "2026-11-11",
    nextAction: "Wait for a reply to the follow-up",
    due: "2026-11-19",
    notes: "AI-first role (Cursor, Lovable, Bolt, Replit, prompt-based building). Applied on Nov 11; the same post was shared again on Nov 14, so no second application was sent.",
    activity: [
      {
        date: "Nov 11",
        text: "Application email sent"
      },
      {
        date: "Nov 14",
        text: "Post seen again; not re-sent because the Nov 11 application is still open"
      },
      {
        date: "Nov 14",
        text: "Follow-up sent in the same thread (Claude 101 certificate, offer of a short practical test)"
      }
    ]
  },
  {
    id: "enablr-full-stack-typescript-ai",
    company: "Enablr Therapy",
    role: "Full-Stack Engineer (TypeScript, AI)",
    location: "Remote (US hours, 6pm–2am PKT) · Pakistan hub",
    source: "Google Form",
    stage: "Draft",
    appliedOn: "2026-11-14",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSdv_A14dNch1PhXY5BcPXtP7yrMrsD3S8t4dY--77JjRu0Xzg/viewform",
    nextAction: "Finish the saved draft: ratings, 4 written answers, CV upload, 1–2 minute video, then Submit",
    due: "2026-11-16",
    notes: "Therapy platform for schools and clinics; TypeScript, React/Next.js, PostgreSQL, Hasura, GraphQL Codegen, LLM APIs. Contact details, links, the project link and the 'why I fit' answer are already filled in the saved draft.",
    activity: [
      {
        date: "Nov 14",
        text: "Form partly filled and saved as a draft; the rest needs your own answers and a video"
      }
    ]
  },
  {
    id: "third-mile-labs-react-native",
    company: "Third Mile Labs",
    role: "React Native Developer",
    location: "Lahore, Pakistan · on-site",
    source: "Job post · email",
    stage: "Applied",
    appliedOn: "2026-11-15",
    link: "https://thirdmilelabs.com/careers",
    nextAction: "Check for a bounce (their domain has no mail record); if it bounces, message them on LinkedIn",
    due: "2026-11-18",
    notes: "Software studio (AI automations, LLM apps, web and mobile). React Native CV tailored to the role, with links to the Hopn passenger and driver apps on both stores.",
    activity: [
      {
        date: "Nov 15",
        text: "Application emailed with a tailored CV and published-app links"
      }
    ]
  }
];

const githubProfile = "https://github.com/HuzaifaBinShahid";

const seededOutreach: Outreach[] = [
  {
    id: "lobna-mahmoud",
    name: "Lobna Mahmoud",
    company: "Undisclosed startup",
    title: "Recruitment Consultant",
    region: "Remote role · Pakistan eligibility pending",
    linkedin: "https://www.linkedin.com/in/lobna-mahmoud-41bbb991/",
    status: "Draft ready",
    angle: "React, Next.js, TypeScript, and three years of production frontend experience",
    researchNote: "Lobna shared a remote mid-level Frontend Engineer opportunity. LinkedIn requires Premium InMail to message her directly because she is a second-degree connection, so no message or connection request was sent.",
    message: "Hi Lobna, I saw your remote mid-level Frontend Engineer role. I have three years of experience building production work with React, Next.js and TypeScript, including SaaS dashboards, API integrations, realtime features and mobile workflows. I am based in Lahore, Pakistan. Could you let me know whether the role can hire remotely from Pakistan? I would be glad to share my CV and GitHub profile.",
    shared: "CV and GitHub profile offered on reply · no message sent"
  },
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
    status: "Sent",
    angle: "MVP delivery across React web and React Native mobile",
    researchNote: "Belcode focuses on turning startup concepts into shipped web and mobile products. A tailored LinkedIn InMail was sent on Oct 13, 2026.",
    message: "Hi Jan, I came across Belcode and liked the mix of product discovery and rapid web and mobile delivery.\n\nI am a frontend and mobile engineer with three years of production experience in React, Next.js, TypeScript and React Native. Recently, I shipped airport ride sharing apps with live maps, real time chat, navigation, notifications and API integrations. I also build SaaS dashboards, booking workflows and payment integrations.\n\nIf Belcode ever needs reliable frontend or mobile capacity for a client delivery, I would be happy to share relevant work or help with a small scoped feature first.\n\nHuzaifa",
    shared: "LinkedIn InMail sent · Relevant work offered on reply · No attachment"
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
    status: "Replied",
    angle: "SaaS product polish, dashboard UX, and testimonial-product surfaces",
    researchNote: "Robi replied on Sep 23, 2026. He is not hiring or subcontracting now, but reviewed Huzaifa's GitHub, liked the RepoCards idea, and kept the profile for possible future work.",
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
  },
  {
    id: "arslan-mir",
    name: "Arslan Mir",
    company: "AssureLogix",
    title: "Founder",
    region: "United States · healthcare technology",
    linkedin: "https://www.linkedin.com/in/arslanmir",
    status: "Sent",
    angle: "Healthcare revenue workflows, product dashboards, and clear user journeys",
    researchNote: "Arslan is building AssureLogix, a healthcare technology platform focused on turning complex clinical data into revenue workflows. A tailored LinkedIn InMail was sent on Oct 13, 2026.",
    message: "Hi Arslan, I have been looking at AssureLogix and the goal of turning complicated healthcare data into useful revenue workflows.\n\nMaking complex information clear for operations teams is work I enjoy. I build React, Next.js, TypeScript and React Native product interfaces, with experience in dashboards, API integrations, real time status flows, maps, notifications and booking systems.\n\nIf a dashboard, workflow or mobile surface needs implementation support, I would be glad to share relevant work and start with a focused piece of work.\n\nHuzaifa",
    shared: "LinkedIn InMail sent · Relevant work offered on reply · No attachment"
  },
  {
    id: "muhammad-sufyan",
    name: "Muhammad Sufyan",
    company: "CODEdinate",
    title: "Founder & CEO",
    region: "Multan, Pakistan · industrial technology",
    linkedin: "https://www.linkedin.com/in/muhammad-sufyan-4175b7323",
    status: "Draft ready",
    angle: "AI powered management systems, real time product workflows, and user facing dashboards",
    researchNote: "Muhammad is building CODEdinate, including a multimodal AI engine and management systems for industrial technology.",
    message: "Hi Muhammad, I saw the CODEdinate work around AI powered management systems and the multimodal engine you are preparing for the cloud. Making complex AI workflows clear and useful for users is the kind of product work I enjoy. I have around three years of React, Next.js, TypeScript, React Native and API driven experience, along with AI integrations and Playwright and Puppeteer automation. If you ever need help with a dashboard, workflow or mobile surface, I would be happy to share relevant work: https://github.com/HuzaifaBinShahid\n\nHuzaifa",
    shared: "GitHub profile included · CV not attached"
  },
  {
    id: "m-faris",
    name: "M. Faris D. K.",
    company: "Farisium",
    title: "Founder",
    region: "Indonesia · AI product builder",
    linkedin: "https://www.linkedin.com/in/m-faris-d-k-638291135",
    status: "Sent",
    angle: "AI product experiences, frontend architecture, and polished customer journeys",
    researchNote: "Faris is building Farisium, an AI powered creative ecosystem focused on scalable digital products and automation. Free LinkedIn message sent Sep 25, 2026.",
    message: "Hi Faris, I liked Farisium and its AI powered creative ecosystem. I have three years of React, Next.js, TypeScript, React Native and API driven product work, plus AI integrations. If a frontend or mobile feature needs support, I would be happy to help. https://github.com/HuzaifaBinShahid",
    shared: "GitHub profile shared · CV not attached"
  },
  {
    id: "aakash-kumar",
    name: "Aakash Kumar",
    company: "Codezania",
    title: "Founder",
    region: "New Delhi, India · product studio",
    linkedin: "https://www.linkedin.com/in/aakash-kumar-codezania",
    status: "Sent",
    angle: "CRM and ERP delivery, responsive product interfaces, and client project capacity",
    researchNote: "Aakash leads Codezania, which builds business websites, SaaS platforms, custom web applications, CRMs, and ERPs. Free LinkedIn message sent Sep 25, 2026.",
    message: "Hi Aakash, I like Codezania's work across CRMs, ERPs and custom web products. I have three years of React, Next.js, TypeScript, React Native and API driven product experience. If a client delivery needs frontend or mobile support, I would be happy to help. https://github.com/HuzaifaBinShahid",
    shared: "GitHub profile shared · CV not attached"
  },
  {
    id: "alfian-azzam",
    name: "Alfian Azzam Haryanto",
    company: "DizzBooth / DizzPOS",
    title: "SaaS Founder",
    region: "Indonesia · product engineer",
    linkedin: "https://www.linkedin.com/in/alfian-azzam",
    status: "Sent",
    angle: "Multi app SaaS products, real time interfaces, and mobile product delivery",
    researchNote: "Alfian is building DizzBooth and DizzPOS, multi app SaaS products with real time and mobile product surfaces. Free LinkedIn message sent Sep 25, 2026.",
    message: "Hi Alfian, I saw DizzBooth and DizzPOS and liked what you are building. I have three years of React, Next.js, TypeScript and React Native work, including real time features, notifications and APIs. If a user facing React or mobile feature needs support, I would be happy to help. https://github.com/HuzaifaBinShahid",
    shared: "GitHub profile shared · CV not attached"
  },
  {
    id: "glideups",
    name: "Glideups team",
    company: "Glideups",
    title: "Contract development partnership",
    region: "Karachi, Pakistan · remote contract work",
    linkedin: "https://www.linkedin.com/company/glideups/",
    status: "Sent",
    angle: "React and React Native capacity for web and app delivery, real time product features, API integrations, and UI polish",
    researchNote: "Glideups publicly asked freelancers and agencies to share portfolios for contract web and app work. A tailored portfolio comment was posted on Oct 11, 2026.",
    message: "Hi Glideups team, I am interested in supporting your contract web and app work. I am a frontend and mobile engineer from Lahore with three years of production experience using React, Next.js, TypeScript and React Native. Recently I have delivered SaaS dashboards, API integrations, realtime chat and notification flows, mapping features, and mobile apps for live users. I can help with React web work, React Native apps, UI polish, integrations, and automation where needed. GitHub: https://github.com/HuzaifaBinShahid Recent project: https://github.com/HuzaifaBinShahid/Repo-cards Happy to discuss how I can help with the current workload.",
    shared: "GitHub profile and Repo cards project link posted in a LinkedIn comment · CV not attached"
  },
  {
    id: "nessovo-agentic-ai-mobile-dev-2026-11-13",
    name: "Hiring team",
    company: "Nessovo Technologies",
    title: "Agentic AI Mobile App Developer (React Native / Expo)",
    region: "Lahore · Johar Town · on-site",
    linkedin: "https://www.linkedin.com/company/nessovo-technologies/",
    status: "Sent",
    angle: "Shipped two React Native apps to both stores in 4 months (Hopn) plus LLM/AI-agent work, the exact React Native + Expo + LLM mix they ask for",
    researchNote: "LinkedIn company post, about 18 h old on Nov 13, 2026: 2 yrs React Native + Expo, EAS Build/Submit, OpenAI/Anthropic APIs, AI agents, streaming chat; nice to have Node, Supabase, Claude Code. Email in the private daily file.",
    message: "Email sent Nov 13 from Gmail with a CV tailored to the role (text in the private applications file, section 13)",
    shared: "Tailored CV, GitHub and project links · emailed Nov 13"
  },
  {
    id: "wondertree-mobile-app-grant-2026-11-13",
    name: "Usman and Waqas (founders)",
    company: "WonderTree",
    title: "Mobile app build funded by a GSMA AI grant",
    region: "Pakistan · UAE presence · remote or Pakistan to confirm",
    linkedin: "https://www.linkedin.com/in/mwwaqas/",
    status: "Sent",
    angle: "Their grant pays for a new mobile app; he is a mobile dev who shipped two React Native apps to both stores in 4 months",
    researchNote: "GSMA Innovation Fund for Impactful AI grant of up to £250,000, announced Nov 13, 2026 (insideai.news), to build a mobile app for their AR therapy games for children with special needs. No careers page or job-board openings. Email (from their website) in the private daily file.",
    message: "Email sent Nov 13 from Gmail with a CV tailored to the role (text in the private applications file, section 13)",
    shared: "Tailored CV, GitHub and project links · emailed Nov 13"
  },
  {
    id: "cogent-labs-full-stack-2026-11-13",
    name: "Reshail Shoaib",
    company: "Cogent Labs",
    title: "Full Stack Engineer (1–3 yrs)",
    region: "Lahore · Township · on-site",
    linkedin: "https://www.linkedin.com/in/reshail-shoaib/",
    status: "Draft ready",
    angle: "React/Next.js front ends for two AI SaaS products at Boolmind plus LLM API work; Django would be new",
    researchNote: "LinkedIn post by their Talent Acquisition Associate, about 18 h old on Nov 13, 2026, 110 reactions: AI, Python, Django, React, Next.js. Apply via the link in the post; no email published.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "wamo-labs-mern-engineer-2026-11-13",
    name: "Hamza Qadeer",
    company: "Wamo Labs",
    title: "MERN / JS Engineer (1+ yr)",
    region: "Lahore · Johar Town · on-site",
    linkedin: "https://www.linkedin.com/in/hamza-qadeer-2280902ab/",
    status: "Draft ready",
    angle: "MERN in production at Boolmind plus client-facing work (Upwork Top Rated, 100% JSS, 8 contracts) for their focus on communication",
    researchNote: "LinkedIn post by their HR Recruitment Assistant, about 21 h old on Nov 13, 2026, 16 reactions: MongoDB/Express/React/Node, must explain code in client meetings. Apply via the link in the post; no email published.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "broadstone-full-stack-2026-11-13",
    name: "Maryam Faraz",
    company: "Broadstone Technologies",
    title: "Software Engineer (Full Stack), up to 3 yrs",
    region: "Lahore · on-site",
    linkedin: "https://www.linkedin.com/in/maryam-faraz-04b92b212/",
    status: "Draft ready",
    angle: "Can own features end to end: AI SaaS front ends, Node APIs and React Native apps; top of their experience range",
    researchNote: "LinkedIn post by their HR / Talent Acquisition, about 21 h old on Nov 13, 2026, 85 reactions: freshers to 3 yrs; also hiring AI/ML and Python backend. Apply via the link in the post; no email published.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "iwan-books-founders-2026-11-13",
    name: "Mohamed Gamal / Ahmed Sami (CTO)",
    company: "Iwan Books",
    title: "Web + iOS/Android app build after angel round",
    region: "Egypt · remote to confirm",
    linkedin: "",
    status: "Draft ready",
    angle: "React Native for one iOS + Android codebase (Hopn) and AI-Video-Maker for their manuscript-to-video feature",
    researchNote: "Angel round (amount undisclosed), Dealroom, Nov 12, 2026: AI self-publishing platform for Gen Z (Arabic + English); funds go to web and native iOS/Android apps. No website or email found; reach the founders on LinkedIn.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "icosynth-fullstack-2026-11-13",
    name: "Hiring team",
    company: "Icosynth",
    title: "Fullstack Developer (4-day week)",
    region: "Sri Lanka · remote not stated",
    linkedin: "https://www.linkedin.com/company/icosynth/",
    status: "Sent",
    angle: "React/Next.js + Node plus AI/automation (n8n, scheduled AI agents); UTC+5:30 is close to Lahore. Ask about remote first",
    researchNote: "LinkedIn company post, about 2 h old on Nov 13, 2026: React/Next.js, Node/Python, APIs, databases, AI and automation; Monday–Thursday week. Email in the private daily file.",
    message: "Email sent Nov 13 from Gmail with a CV tailored to the role (text in the private applications file, section 13)",
    shared: "Tailored CV, GitHub and project links · emailed Nov 13"
  },
  {
    id: "enfu-solutions-mern-2026-11-13",
    name: "Hiring team",
    company: "Enfu Solutions Pvt Ltd",
    title: "MERN Stack Developer (2 yrs)",
    region: "Lahore · on-site",
    linkedin: "https://www.linkedin.com/company/rozgaar-alert/",
    status: "Draft ready",
    angle: "MERN dashboards and Node + MongoDB APIs from Boolmind",
    researchNote: "Posted by the job page Rozgaar Alert, about 19 h old on Nov 13, 2026: full time, salary open. No email, website or careers page found. Low priority.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "innovex-ai-junior-full-stack-2026-11-13",
    name: "Hiring team",
    company: "Innovex AI",
    title: "Junior Full-Stack Developer",
    region: "UAE · remote or on-site to confirm",
    linkedin: "https://www.linkedin.com/company/innovex-ai/",
    status: "Sent",
    angle: "Their stack (React, Next.js, TypeScript, Node, Supabase, PostgreSQL) matches LenaDena and his Next.js + Supabase work",
    researchNote: "LinkedIn company post, about 23 min old at the first scan on Nov 13, 2026. Email in the private daily file.",
    message: "Email sent Nov 13 from Gmail with a CV tailored to the role (text in the private applications file, section 13)",
    shared: "Tailored CV, GitHub and project links · emailed Nov 13"
  },
  {
    id: "metal-usman-gul-2026-11-13",
    name: "Usman Gul",
    company: "Metal (metal.so)",
    title: "Founder and CEO",
    region: "Pakistan · startup",
    linkedin: "https://www.ycombinator.com/companies/metal-2",
    status: "Draft ready",
    angle: "AI SaaS front ends (Hintsy AI) and Node + MongoDB APIs from Boolmind fit their AI fundraising product",
    researchNote: "$4.5M seed led by a16z Speedrun and Y Combinator, Sep 2026 (ProPakistani). Airlift co-founder. No email published; reach him on LinkedIn or X.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "fin-com-founders-2026-11-13",
    name: "Mustafa Dar / Nabeel Alamgir",
    company: "Fin.com",
    title: "Co-founders",
    region: "Lahore office · cross-border payments",
    linkedin: "",
    status: "Draft ready",
    angle: "Lahore-based engineer with real-time mobile apps (Hopn) and SaaS dashboards (Boolmind)",
    researchNote: "$20M seed led by Expa, closed Aug 2026, announced Sep 2026 (ARY News). Lahore is one of six offices. Only press/sales emails published; reach the founders on LinkedIn.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "laam-arif-iqbal-2026-11-13",
    name: "Arif Iqbal",
    company: "LAAM",
    title: "CEO",
    region: "Lahore · NASTP · e-commerce",
    linkedin: "",
    status: "Draft ready",
    angle: "Next.js performance work (Lighthouse 82 to 100) and LLM features for their AI discovery tools",
    researchNote: "$5.5M seed led by disrupt.com, Jul 2026 (Dealroom). The funds go to AI discovery and logistics tools; 37 openings at laam.peopleforce.io/careers (check for engineering roles).",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "gaps-japan-anil-gyawali-2026-11-14",
    name: "Anil Gyawali",
    company: "GAPS JAPAN",
    title: "CEO",
    region: "Japan · remote not stated (ask) · React Native app",
    linkedin: "https://www.linkedin.com/in/anil-gyawali-440aa387/",
    status: "Draft ready",
    angle: "Only mobile dev who shipped Hopn's two React Native apps to both stores in 4 months; they need an RN app built and released on iOS + Android",
    researchNote: "LinkedIn post by the CEO, about 7 h old on 2026-11-14: looking for a React Native developer to build and release the JOHO PORTAL app (React Native, TypeScript, API integration, App Store + Google Play). The post asks for a DM with app links. No email published.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "aurix-tech-frontend-2026-11-14",
    name: "Hiring team",
    company: "Aurix Tech",
    title: "Frontend Developer (3–6 yrs)",
    region: "Lahore · on-site",
    linkedin: "https://www.linkedin.com/company/lahore-jobs/",
    status: "Draft ready",
    angle: "3.5 years of React/Next.js front ends (two AI SaaS platforms at Boolmind, Lighthouse 82 to 100 on a client's Next.js site) fits their 3–6 year frontend role",
    researchNote: "Job ad reposted by Lahore Jobs, Pakistan IT Jobs and Job Ads Pakistan on LinkedIn, 17–23 h old on 2026-11-14. Hashtags: React, Next.js, Node, TypeScript, Tailwind, Python/Django; 'global projects'. Also hiring backend (3–6) and a senior architect. Email in the private daily file; aurixtech.com did not load.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "la-viral-studio-alexandre-2026-11-14",
    name: "Alexandre (@buildwithalex)",
    company: "La Viral Studio",
    title: "Founder, Chief Vibe Coding Officer",
    region: "Remote · Montreal ideally, open to remote",
    linkedin: "https://x.com/buildwithalex/status/2121335521779524003",
    status: "Draft ready",
    angle: "Their stack is exactly yours (TypeScript, React Native, Next.js, Node.js) and they ship consumer mobile apps and AI products",
    researchNote: "X post, about 7 h old on 2026-11-14: hiring a software engineer, Montreal ideally, open to remote; says 'send me a DM'. Studio builds mobile apps (Flashloop, Buy Beaver), viral web products and AI agents. No email published; careers page on Notion did not render.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "multipolitan-founders-2026-11-14",
    name: "Nirbhay Handa / Lee Smith",
    company: "Multipolitan",
    title: "Founders",
    region: "Remote? · UAE / Singapore / India team · consumer app",
    linkedin: "https://www.linkedin.com/company/multipolitan/",
    status: "Draft ready",
    angle: "Their consumer app launches in December (document expiry alerts, flight tracking); you shipped two React Native apps in 4 months with push and live tracking",
    researchNote: "$2M pre-seed led by EmergentX, 10 Nov 2026 (Wamda). 40+ people across UAE, India, Singapore; plans to expand the team. 1 job on LinkedIn, none in Pakistan. A general contact email is published on their site (in the private daily file).",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "grabrfi-founders-2026-11-14",
    name: "Artem Fedyaev / Daria Rebenok",
    company: "GrabrFi",
    title: "Co-founders",
    region: "Remote? · fintech for people outside the US",
    linkedin: "",
    status: "Draft ready",
    angle: "You are their user (a remote engineer outside the US paid in USD via Upwork) and you build mobile apps and dashboards",
    researchNote: "$6M led by Bling Capital, 13 Nov 2026 (Dealroom). Dollar accounts for people outside the US; 100,000+ accounts; adding business and euro accounts and credit. Top markets Argentina and Nigeria. No email or openings found; site behind a Cloudflare check. Reach the founders on LinkedIn.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "mawsool-founders-2026-11-14",
    name: "Osama Abdelhadi / Oday Ali",
    company: "Mawsool",
    title: "Co-founders",
    region: "Riyadh · remote? (UTC+3)",
    linkedin: "",
    status: "Draft ready",
    angle: "Front end of a LinkedIn recruiting platform and scheduled AI agents at Boolmind match their AI prospecting and lead-generation product",
    researchNote: "Undisclosed pre-seed (Parachute16, THANAWI, angels), 10 Nov 2026 (Wamda). AI-driven B2B sales intelligence; funds go to technology and MENA expansion. No website or email found; reach the founders on LinkedIn.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
  },
  {
    id: "sbs-junior-full-stack-2026-11-14",
    name: "Hiring team",
    company: "SBS (sbsol.net)",
    title: "Junior Full Stack Developer (1–2 yrs)",
    region: "Islamabad · on-site likely",
    linkedin: "https://www.linkedin.com/company/sbsdistribution/",
    status: "Draft ready",
    angle: "React + Node/Express + MongoDB, the Boolmind stack; low priority (junior, Islamabad)",
    researchNote: "Company LinkedIn post, about 15 h old on 2026-11-14, 24 reactions: React, Node/Express, MySQL or MongoDB, REST, Git. Email in the private daily file.",
    message: "Not drafted: write 4–5 lines in your own words (see angle)",
    shared: "Nothing sent"
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
        if (Array.isArray(parsed) && parsed.length) {
          const latestGlitchDevs = seededApplications.find((application) => application.id === "glitch-devs-frontend-developer");
          const migratedApplications = parsed.map((application) => application.id === "glitch-devs-frontend-developer" && latestGlitchDevs
            ? { ...application, ...latestGlitchDevs }
            : application);
          const newSeededApplications = seededApplications.filter((seeded) => !migratedApplications.some((savedApplication) => savedApplication.id === seeded.id));
          setApplications([...newSeededApplications, ...migratedApplications]);
        }
      } catch {
        // Keep the starter data if a saved record is invalid.
      }
    }
    const savedOutreach = window.localStorage.getItem("application-ledger-outreach");
    if (savedOutreach) {
      try {
        const parsed = JSON.parse(savedOutreach) as Outreach[];
        if (Array.isArray(parsed) && parsed.length) {
          const migratedOutreach = parsed.map((savedContact) => {
            const seeded = seededOutreach.find((candidate) => candidate.id === savedContact.id);
            return seeded && seeded.status !== "Draft ready" && savedContact.status === "Draft ready"
              ? { ...savedContact, status: seeded.status, message: seeded.message, shared: seeded.shared }
              : savedContact;
          });
          const newSeededOutreach = seededOutreach.filter((seeded) => !migratedOutreach.some((savedContact) => savedContact.id === seeded.id));
          setOutreach([...newSeededOutreach, ...migratedOutreach]);
        }
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
