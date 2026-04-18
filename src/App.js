import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

    :root {
      --sidebar-bg: #0f0e0c;
      --sidebar-text: #e8e4dc;
      --sidebar-sub: #8a8478;
      --sidebar-muted: #4a4840;
      --sidebar-border: #2a2924;
      --sidebar-accent: #c9a84c;
      --sidebar-hover: #1a1916;
      --sidebar-active: #1f1e1a;

      --content-bg: #f5f2ed;
      --content-card: #ffffff;
      --content-text: #1a1714;
      --content-sub: #6b6158;
      --content-muted: #a09990;
      --content-line: #e5e0d8;
      --content-accent: #c9a84c;
      --content-gold: #b8942e;
      --content-green: #2d7a4f;

      --serif: 'EB Garamond', Georgia, serif;
      --sans: 'Outfit', sans-serif;
      --mono: 'DM Mono', monospace;

      --sidebar-w: 320px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--sidebar-bg); color: var(--content-text); font-family: var(--sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--sidebar-muted); border-radius: 1px; }
    a { text-decoration: none; color: inherit; }
    ::selection { background: rgba(201,168,76,0.2); }

    .layout {
      display: flex;
      min-height: 100vh;
    }

    /* SIDEBAR */
    .sidebar {
      width: var(--sidebar-w);
      min-height: 100vh;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--sidebar-border);
      position: fixed;
      top: 0; left: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      padding: 40px 28px;
      overflow-y: auto;
      z-index: 50;
    }

    /* CONTENT */
    .content {
      margin-left: var(--sidebar-w);
      flex: 1;
      background: var(--content-bg);
      min-height: 100vh;
    }

    .section {
      padding: 72px 56px;
      border-bottom: 1px solid var(--content-line);
    }

    /* NAV */
    .nav-item {
      display: flex; align-items: center; gap: 14px;
      padding: 11px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.18s, color 0.18s;
      color: var(--sidebar-sub);
      background: transparent;
      border: none;
      font-family: var(--sans);
      font-size: 13.5px;
      font-weight: 400;
      width: 100%;
      text-align: left;
      margin-bottom: 2px;
    }
    .nav-item:hover { background: var(--sidebar-hover); color: var(--sidebar-text); }
    .nav-item.active { background: var(--sidebar-active); color: var(--sidebar-text); border-left: 2px solid var(--sidebar-accent); padding-left: 10px; }
    .nav-num { font-family: var(--mono); font-size: 10px; color: var(--sidebar-accent); width: 18px; flex-shrink: 0; }

    /* TAGS */
    .tag {
      display: inline-block;
      font-family: var(--mono);
      font-size: 10px;
      padding: 3px 8px;
      background: transparent;
      border: 1px solid var(--content-line);
      border-radius: 4px;
      color: var(--content-sub);
    }

    /* PROJ CARDS */
    .proj-card {
      background: var(--content-card);
      border: 1px solid var(--content-line);
      border-radius: 10px;
      padding: 24px;
      cursor: pointer;
      transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
      margin-bottom: 16px;
    }
    .proj-card:hover {
      transform: translateY(-2px);
      border-color: var(--content-accent);
      box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    }

    /* EXP CARDS */
    .exp-card {
      background: var(--content-card);
      border: 1px solid var(--content-line);
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 14px;
    }

    /* SKILL TRACK */
    .skill-track { height: 1.5px; background: var(--content-line); border-radius: 1px; overflow: hidden; margin-top: 7px; }
    .skill-fill { height: 100%; background: linear-gradient(90deg, var(--content-accent), var(--content-gold)); border-radius: 1px; transition: width 1.3s cubic-bezier(0.22,1,0.36,1); }

    /* FORM */
    .field {
      width: 100%; padding: 11px 14px;
      background: var(--content-bg); border: 1px solid var(--content-line);
      border-radius: 6px; font-family: var(--sans); font-size: 13px;
      color: var(--content-text); outline: none; transition: border-color 0.18s;
    }
    .field:focus { border-color: var(--content-accent); }
    .field::placeholder { color: var(--content-muted); }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 22px; background: var(--sidebar-bg); color: var(--sidebar-text);
      font-family: var(--sans); font-size: 13px; font-weight: 500;
      border: none; border-radius: 6px; cursor: pointer;
      transition: opacity 0.18s, transform 0.15s;
    }
    .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 22px; background: transparent; color: var(--content-sub);
      font-family: var(--sans); font-size: 13px; font-weight: 500;
      border: 1px solid var(--content-line); border-radius: 6px; cursor: pointer;
      transition: all 0.18s;
    }
    .btn-outline:hover { border-color: var(--content-text); color: var(--content-text); }

    .btn-gold {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 9px 18px; background: var(--sidebar-accent); color: var(--sidebar-bg);
      font-family: var(--sans); font-size: 12px; font-weight: 600;
      border: none; border-radius: 6px; cursor: pointer;
      transition: opacity 0.18s, transform 0.15s;
    }
    .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }

    @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none} }

    /* MOBILE */
    .mobile-header { display: none; }
    .mobile-menu-overlay { display: none; }

    @media (max-width: 900px) {
      :root { --sidebar-w: 0px; }

      .sidebar { display: none; }
      .content { margin-left: 0; }

      .mobile-header {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        background: var(--sidebar-bg);
        padding: 0 20px; height: 56px;
        border-bottom: 1px solid var(--sidebar-border);
      }

      .section { padding: 48px 20px; }

      .mobile-menu-overlay {
        display: block;
        position: fixed; inset: 0; z-index: 90;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
      }

      .mobile-menu-panel {
        position: fixed; top: 0; left: 0; bottom: 0; z-index: 95;
        width: 280px;
        background: var(--sidebar-bg);
        border-right: 1px solid var(--sidebar-border);
        padding: 80px 20px 40px;
        overflow-y: auto;
        animation: slideIn 0.2s ease;
      }
    }

    @media (max-width: 600px) {
      .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
      .skills-grid-inner { grid-template-columns: 1fr !important; }
      .contact-grid-inner { grid-template-columns: 1fr !important; }
      .cert-cards { grid-template-columns: 1fr !important; }
    }

    /* Special mobile bottom nav */
    .mobile-bottom-nav {
      display: none;
    }
    @media (max-width: 900px) {
      .mobile-bottom-nav {
        display: flex;
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
        background: var(--sidebar-bg);
        border-top: 1px solid var(--sidebar-border);
        padding: 8px 0 env(safe-area-inset-bottom, 8px);
      }
      .mob-nav-btn {
        flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
        background: none; border: none; cursor: pointer; padding: 6px 4px;
        color: var(--sidebar-sub); font-family: var(--mono); font-size: 9px;
        transition: color 0.18s;
      }
      .mob-nav-btn.active { color: var(--sidebar-accent); }
      .mob-nav-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--sidebar-accent); display: none; }
      .mob-nav-btn.active .mob-nav-dot { display: block; }

      .content { padding-bottom: 64px; }
    }
  `}</style>
);

const Typewriter = ({ words, speed = 65, pause = 2400 }) => {
  const [idx, setIdx] = useState(0), [sub, setSub] = useState(0), [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[idx];
    const t = del
      ? setTimeout(() => { setSub(s => s - 1); if (sub <= 1) { setDel(false); setIdx(i => (i + 1) % words.length); } }, 28)
      : sub < word.length ? setTimeout(() => setSub(s => s + 1), speed)
      : setTimeout(() => setDel(true), pause);
    return () => clearTimeout(t);
  }, [idx, sub, del, words, speed, pause]);
  return (
    <>
      <span style={{ color: "var(--sidebar-accent)" }}>{words[idx].slice(0, sub)}</span>
      <span style={{ animation: "blink 1s step-end infinite", color: "var(--sidebar-accent)" }}>|</span>
    </>
  );
};

const SectionLabel = ({ num, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--content-accent)" }}>{num}</span>
    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: "var(--content-text)", lineHeight: 1.1, marginBottom: 40, letterSpacing: "-0.5px" }}>
    {children}
  </h2>
);

const SkillBar = ({ name, level, delay }) => {
  const [w, setW] = useState(0); const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setW(level), delay); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, [level, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "var(--content-sub)", fontWeight: 400 }}>{name}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)" }}>{level}%</span>
      </div>
      <div className="skill-track"><div className="skill-fill" style={{ width: `${w}%` }} /></div>
    </div>
  );
};

const GH = <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const LI = <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const EM = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>;
const PH = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.34 6.34l1.47-1.47a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const ARR = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>;

const PROJECTS = [
  {
    num: "01",
    status: "ONGOING",
    tag: "DISTRIBUTED SYSTEMS",
    title: "TicketFlow",
    description: "Distributed ticket booking system handling 5K+ concurrent users with sub-200ms latency. Redis distributed seat locking, Kafka async pipelines, JWT RBAC security.",
    tech: ["Spring Boot", "MySQL", "Redis", "Kafka", "JWT"],
    metrics: ["↑ 5K users", "<200ms"],
    detail: "Designed a distributed ticket booking system handling 5K+ concurrent users. Implemented Redis-based distributed seat locking (SET NX + TTL 10 min) to prevent race conditions. Built event-driven architecture using Apache Kafka for booking and notification services. Secured APIs using stateless JWT authentication with RBAC and BCrypt encryption. Developed real-time seat availability system with full CRUD.",
    arch: "Event-Driven Microservices",
    github: "https://github.com/yashpatil1816",
    highlight: true,
  },
  {
    num: "02",
    status: "BUILT",
    tag: "AGENTIC AI",
    title: "Transaction Insight Engine",
    description: "Real-time UPI fraud detection. 4-rule engine auto-routes 85% of transactions. LangChain4j agentic loop handles uncertain cases in <100ms.",
    tech: ["Java 17", "Kafka", "LangChain4j", "Redis", "Spring AI"],
    metrics: ["↑ <100ms", "85% routed"],
    detail: "Designed a real-time fraud detection pipeline using Kafka for async event streaming and Redis for per-user transaction caching, enabling decisions in <100ms. Built a 4-rule deterministic engine (amount spike, rapid-fire, new location, new device) classifying transactions as APPROVE / FLAG / BLOCK / UNCERTAIN. Integrated LangChain4j agentic loop for uncertain cases — the agent performs step-by-step reasoning, calls tools (getUserHistory, queryPatterns, blockTransaction), and logs reasoning traces to MySQL. Implemented Kafka DLQ for fault tolerance and OTP fallback within <5 seconds. Live dashboard with Vanilla JS.",
    arch: "Agentic AI + Event-Driven",
    github: "https://github.com/yashpatil1816",
    highlight: false,
  },
  {
    num: "03",
    status: "JAN 2025",
    tag: "VIRTUAL · FORAGE",
    title: "J.P. Morgan SWE",
    description: "Software engineering virtual experience: Java + Spring Boot REST APIs, Apache Kafka async messaging, JPA entities with H2 database.",
    tech: ["Java", "Spring Boot", "Apache Kafka", "JPA", "H2"],
    metrics: ["REST APIs", "Kafka"],
    detail: "Completed J.P. Morgan Chase & Co. Software Engineering Virtual Experience on Forage. Developed backend services using Java and Spring Boot handling REST APIs. Integrated Apache Kafka for asynchronous communication, improving scalability and service decoupling. Modeled relational entities using Spring Data JPA and persisted data in H2 database. Applied layered Controller–Service–Repository architecture for clean modular design.",
    arch: "Controller – Service – Repository",
    github: "https://github.com/yashpatil1816",
    highlight: false,
  },
  {
    num: "04",
    status: "2024",
    tag: "API INTEGRATION",
    title: "WeatherSphere",
    description: "Real-time weather data proxy service integrating OpenWeatherMap REST API — routing, transformation, and error handling.",
    tech: ["Java", "Spring Boot", "REST API", "OpenWeatherMap"],
    metrics: ["Live API", "Proxy"],
    detail: "Spring Boot service acting as a proxy to OpenWeatherMap REST API. Handles request routing, response transformation, error management, and JSON deserialization. Demonstrates clean REST API integration patterns and third-party service abstraction.",
    arch: "API Proxy + Transform",
    github: "https://github.com/yashpatil1816",
    highlight: false,
  },
];

const SKILLS_DATA = [
  { name: "Java", level: 90 },
  { name: "Spring Boot / Spring Security", level: 87 },
  { name: "REST APIs & Architecture", level: 85 },
  { name: "Spring Data JPA / Hibernate", level: 83 },
  { name: "SQL & Database Design", level: 80 },
  { name: "Apache Kafka", level: 75 },
  { name: "Redis & Distributed Systems", level: 72 },
  { name: "LangChain4j / Spring AI", level: 68 },
  { name: "DSA & Problem Solving", level: 80 },
];

const SKILL_CATEGORIES = [
  { label: "LANGUAGES", items: ["Java", "JavaScript", "SQL", "Python"] },
  { label: "FRAMEWORKS", items: ["Spring Boot", "Spring Security", "Spring Data JPA", "Hibernate"] },
  { label: "INFRASTRUCTURE", items: ["Apache Kafka", "Redis", "Docker", "Jenkins", "GitHub Actions"] },
  { label: "DATABASES", items: ["MySQL", "H2", "Redis Cache"] },
  { label: "AI / ML", items: ["LangChain4j", "Spring AI", "Generative AI"] },
  { label: "TESTING", items: ["JUnit", "TestNG", "Postman", "API Testing"] },
  { label: "CONCEPTS", items: ["Microservices", "REST APIs", "CI/CD", "Distributed Systems", "Event-Driven", "JWT & RBAC"] },
];

const CERTS = [
  { icon: "🏅", label: "Oracle Cloud Infrastructure · 2025", title: "AI Foundations Associate", org: "Oracle" },
  { icon: "📜", label: "Udemy · Feb 2026", title: "Spring, Spring Boot, MVC & Hibernate", org: "Udemy" },
  { icon: "📜", label: "Code For Success · Oct 2025", title: "Java Full Stack Development", org: "Code For Success" },
];

const EXPERIENCE = [
  {
    company: "J.P. Morgan Chase & Co.",
    role: "Software Engineering Virtual Experience",
    period: "Jan 2025",
    type: "Forage (Virtual Program)",
    description: "Completed the J.P. Morgan SWE Virtual Experience Program on Forage.",
    bullets: [
      "Developed backend services using Java and Spring Boot, handling REST APIs and improving response efficiency.",
      "Integrated Apache Kafka for asynchronous communication, improving scalability and service decoupling.",
      "Modeled relational entities using Spring Data JPA and persisted data in an H2 database.",
      "Applied layered architecture (Controller–Service–Repository) for clean and modular design.",
    ],
    tech: ["Java", "Spring Boot", "Apache Kafka", "JPA", "H2"],
  },
];

const LINKS_DATA = [
  { label: "GitHub — yashpatil1816", url: "https://github.com/yashpatil1816" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/yash-patil-39941a326/" },
  { label: "yashpatil2571@gmail.com", url: "mailto:yashpatil2571@gmail.com" },
  { label: "LeetCode — 200+ solved", url: "https://leetcode.com" },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", num: "00" },
  { id: "about", label: "About", num: "01" },
  { id: "skills", label: "Skills", num: "02" },
  { id: "projects", label: "Projects", num: "03" },
  { id: "experience", label: "Experience", num: "04" },
  { id: "contact", label: "Contact", num: "05" },
];

const MOB_NAV = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "about", label: "About", icon: "◎" },
  { id: "skills", label: "Skills", icon: "◈" },
  { id: "projects", label: "Proj", icon: "◻" },
  { id: "experience", label: "Exp", icon: "◆" },
  { id: "contact", label: "Contact", icon: "◉" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [modal, setModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const { scrollYProgress } = useScroll();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.3 });
    NAV_ITEMS.forEach(n => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!formState.name || !formState.email || !formState.message) { setSendError("Please fill in all fields."); return; }
    setSendError("");
    const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`);
    window.location.href = `mailto:yashpatil2571@gmail.com?subject=${subject}&body=${body}`;
    setSent(true); setFormState({ name: "", email: "", message: "" });
  };

  const SidebarContent = () => (
    <>
      {/* Profile */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--sidebar-border)", marginBottom: 16 }}>
          <img src="/profile.jpg" alt="Yash Patil" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--content-green)", display: "inline-block", animation: "pulse 2.5s infinite", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-green)", letterSpacing: "0.06em" }}>Available</span>
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 500, color: "var(--sidebar-text)", lineHeight: 1.1, marginBottom: 4 }}>
          Yash<br /><span style={{ color: "var(--sidebar-accent)", fontStyle: "italic" }}>Patil</span>
        </h1>
        <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--sidebar-sub)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>Java Backend Developer</p>
      </div>

      <div style={{ width: "100%", height: 1, background: "var(--sidebar-border)", marginBottom: 28 }} />

      {/* Navigation */}
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--sidebar-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, paddingLeft: 12 }}>Navigation</p>
        {NAV_ITEMS.map(n => (
          <button key={n.id} className={`nav-item ${activeSection === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>
            <span className="nav-num">{n.num}</span>
            {n.label}
            {activeSection === n.id && <span style={{ marginLeft: "auto", width: 16, height: 1, background: "var(--sidebar-accent)" }} />}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: 1, background: "var(--sidebar-border)", margin: "24px 0" }} />

      {/* Links */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--sidebar-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>Links</p>
        {LINKS_DATA.map((l, i) => (
          <a key={i} href={l.url} target={l.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--sidebar-sub)", padding: "5px 4px", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--sidebar-text)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--sidebar-sub)"}>
            <span style={{ fontSize: 10, color: "var(--sidebar-muted)" }}>›</span> {l.label}
          </a>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 32 }}>
        <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-gold" style={{ width: "100%", justifyContent: "center" }}>
          ↓ Download Resume
        </a>
      </div>
    </>
  );

  return (
    <div className="layout">
      <GlobalStyle />

      {/* Progress bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "var(--sidebar-accent)", transformOrigin: "left", scaleX: scrollYProgress, zIndex: 1000 }} />

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--sidebar-border)" }}>
            <img src="/profile.jpg" alt="YP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%" }} />
          </div>
          <div>
            <span style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--sidebar-text)", fontWeight: 500 }}>Yash Patil</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--content-green)", display: "inline-block", animation: "pulse 2.5s infinite" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-green)" }}>Available</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: 11, padding: "7px 13px" }}>Resume</a>
          <button onClick={() => setMobileMenuOpen(m => !m)}
            style={{ background: "none", border: "1px solid var(--sidebar-border)", borderRadius: 6, padding: "7px 9px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 1.5, background: "var(--sidebar-text)", borderRadius: 1, transition: "all 0.2s", transform: mobileMenuOpen ? (i===0?"rotate(45deg) translate(3.5px,3.5px)":i===2?"rotate(-45deg) translate(3.5px,-3.5px)":"scaleX(0)"):"none" }} />)}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div className="mobile-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} />
            <div className="mobile-menu-panel">
              <SidebarContent />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        {MOB_NAV.map(n => (
          <button key={n.id} className={`mob-nav-btn ${activeSection === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
            <span className="mob-nav-dot" />
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="content">

        {/* HOME */}
        <section id="home" className="section" style={{ paddingTop: "clamp(80px, 12vw, 120px)", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--content-muted)", letterSpacing: "0.12em", marginBottom: 20, textTransform: "uppercase" }}>Backend Engineer. Problem Solver.</p>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(48px,8vw,88px)", fontWeight: 500, color: "var(--content-text)", lineHeight: 1.0, letterSpacing: "-2px", marginBottom: 16 }}>
              Backend<br /><em style={{ color: "var(--content-accent)", fontStyle: "italic" }}>Engineer.</em><br />Problem<br />Solver.
            </h1>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--content-sub)", marginBottom: 28, minHeight: 20 }}>
              <Typewriter words={["Java Backend Developer", "Spring Boot Engineer", "Distributed Systems", "Agentic AI Builder"]} />
            </div>
            <p style={{ fontSize: 15, color: "var(--content-sub)", lineHeight: 1.9, maxWidth: 520, marginBottom: 40 }}>
              I build <strong style={{ color: "var(--content-text)", fontWeight: 600 }}>distributed systems</strong> that scale. From <strong style={{ color: "var(--content-text)", fontWeight: 600 }}>5K+ concurrent</strong> ticket bookings to <strong style={{ color: "var(--content-text)", fontWeight: 600 }}>sub-100ms fraud detection</strong> with Agentic AI — I engineer backends that are fast, fault-tolerant, and production-ready.
            </p>
            <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--content-line)", border: "1px solid var(--content-line)", borderRadius: 10, overflow: "hidden", maxWidth: 460, marginBottom: 40 }}>
              {[{ n: "200+", l: "DSA Problems" }, { n: "8.18", l: "CGPA" }, { n: "2027", l: "Graduating" }].map((s, i) => (
                <div key={i} style={{ background: "var(--content-card)", padding: "18px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 500, color: "var(--content-text)" }}>{s.n}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("projects")} className="btn-primary">View Projects →</button>
              <button onClick={() => scrollTo("contact")} className="btn-outline">Let's Connect</button>
            </div>
          </motion.div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <SectionLabel num="01 —" label="About" />
          <SectionTitle>Backends Built<br />for Production</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 15, color: "var(--content-sub)", lineHeight: 1.9, marginBottom: 16 }}>
                I'm a <strong style={{ color: "var(--content-text)" }}>Java Backend Developer</strong> pursuing B.Tech in Information Technology at G.H. Raisoni College of Engineering, Pune. My work sits at the intersection of distributed systems, event-driven architecture, and applied AI.
              </p>
              <p style={{ fontSize: 15, color: "var(--content-sub)", lineHeight: 1.9, marginBottom: 28 }}>
                Whether it's preventing race conditions with <strong style={{ color: "var(--content-text)" }}>Redis distributed locking</strong>, routing transactions through a <strong style={{ color: "var(--content-text)" }}>Kafka pipeline</strong>, or deploying a <strong style={{ color: "var(--content-text)" }}>LangChain4j agentic loop</strong> for intelligent fraud detection — I design for scale and resilience.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["OOP", "REST", "Microservices", "JWT", "Spring Security", "DSA", "JPA", "Kafka", "Redis", "LangChain4j"].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div>
              {/* Education card */}
              <div style={{ background: "var(--content-card)", border: "1px solid var(--content-line)", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  {[
                    { label: "DEGREE", value: "B.Tech — Information Technology" },
                    { label: "UNIVERSITY", value: "G.H. Raisoni, Pune" },
                    { label: "CGPA", value: "8.18 / 10" },
                    { label: "GRADUATING", value: "Expected 2027" },
                  ].map((row, i) => (
                    <div key={i} style={{ padding: "16px", borderRight: i % 2 === 0 ? "1px solid var(--content-line)" : "none", borderBottom: i < 2 ? "1px solid var(--content-line)" : "none" }}>
                      <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{row.label}</p>
                      <p style={{ fontSize: 13, color: "var(--content-text)", fontWeight: 500, lineHeight: 1.4 }}>{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Certs */}
              <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Certifications</p>
              <div className="cert-cards" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {CERTS.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "var(--content-card)", border: "1px solid var(--content-line)", borderRadius: 8 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", letterSpacing: "0.08em", marginBottom: 2 }}>{c.label}</p>
                      <p style={{ fontSize: 12, color: "var(--content-sub)" }}>{c.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section">
          <SectionLabel num="02 —" label="Skills" />
          <SectionTitle>Tech Stack</SectionTitle>
          <div className="skills-grid-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
            <div>
              <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Categories</p>
              {SKILL_CATEGORIES.map((cat, ci) => (
                <div key={ci} style={{ marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-accent)", textTransform: "uppercase", letterSpacing: "0.1em", width: 90, flexShrink: 0, paddingTop: 3 }}>{cat.label}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {cat.items.map(item => <span key={item} className="tag" style={{ fontSize: 11 }}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Proficiency</p>
              {SKILLS_DATA.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 80} />)}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section">
          <SectionLabel num="03 —" label="Projects" />
          <SectionTitle>Selected Work</SectionTitle>
          {PROJECTS.map((p, i) => (
            <motion.div key={p.title} className="proj-card"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              onClick={() => setModal(p)}
              style={{ borderLeft: p.highlight ? "3px solid var(--content-accent)" : "1px solid var(--content-line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)" }}>{p.num} · {p.status}</span>
                </div>
                <span className="tag" style={{ fontSize: 10 }}>{p.tag}</span>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 500, color: "var(--content-text)", marginBottom: 10, lineHeight: 1.2 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: "var(--content-sub)", lineHeight: 1.8, marginBottom: 14 }}>{p.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {p.tech.map(t => <span key={t} className="tag" style={{ fontSize: 10 }}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {p.metrics.map((m, mi) => (
                    <span key={mi} style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-accent)", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, padding: "2px 8px" }}>{m}</span>
                  ))}
                  <span style={{ fontSize: 12, color: "var(--content-accent)", fontWeight: 500 }}>Details →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="section">
          <SectionLabel num="04 —" label="Experience" />
          <SectionTitle>Professional<br />Experience</SectionTitle>
          {EXPERIENCE.map((exp, i) => (
            <motion.div key={i} className="exp-card"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ borderLeft: "3px solid var(--content-accent)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, color: "var(--content-text)", marginBottom: 4 }}>{exp.company}</h3>
                  <p style={{ fontSize: 14, color: "var(--content-sub)", fontWeight: 500 }}>{exp.role}</p>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)", marginTop: 3 }}>{exp.type}</p>
                </div>
                <span className="tag" style={{ fontSize: 11, padding: "5px 10px" }}>{exp.period}</span>
              </div>
              <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 16 }}>
                {exp.bullets.map((b, bi) => (
                  <li key={bi} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--content-sub)", lineHeight: 1.8, marginBottom: 6 }}>
                    <span style={{ color: "var(--content-accent)", flexShrink: 0, marginTop: 2 }}>—</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {exp.tech.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </motion.div>
          ))}

          {/* Open to opportunities note */}
          <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(45,122,79,0.06)", border: "1px solid rgba(45,122,79,0.2)", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--content-green)", animation: "pulse 2.5s infinite", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "var(--content-sub)" }}>Currently available — open to Java Backend, SWE & Internship roles.</p>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section">
          <SectionLabel num="05 —" label="Contact" />
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px,4vw,48px)", fontWeight: 500, color: "var(--content-text)", lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 8 }}>
              Let's build<br /><em style={{ color: "var(--content-accent)", fontStyle: "italic" }}>something great.</em>
            </h2>
            <p style={{ fontSize: 14, color: "var(--content-muted)", fontFamily: "var(--mono)", marginTop: 10 }}>Every message hits my inbox. I respond within a day.</p>
          </div>

          <div className="contact-grid-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48 }}>
            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "GITHUB", handle: "yashpatil1816", url: "https://github.com/yashpatil1816", icon: GH },
                { label: "LINKEDIN", handle: "yash-patil-39941a326", url: "https://www.linkedin.com/in/yash-patil-39941a326/", icon: LI },
                { label: "EMAIL", handle: "yashpatil2571@gmail.com", url: "mailto:yashpatil2571@gmail.com", icon: EM },
                { label: "PHONE", handle: "+91 9022046356", url: "tel:+919022046356", icon: PH },
              ].map((c, i) => (
                <motion.a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 16px", background: "var(--content-card)", border: "1px solid var(--content-line)", borderRadius: 8, transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--content-accent)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--content-line)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--content-bg)", border: "1px solid var(--content-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--content-sub)", flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{c.label}</p>
                      <p style={{ fontSize: 12, color: "var(--content-text)", fontWeight: 500 }}>{c.handle}</p>
                    </div>
                  </div>
                  <span style={{ color: "var(--content-muted)", flexShrink: 0 }}>{ARR}</span>
                </motion.a>
              ))}
            </div>

            {/* Form */}
            <div style={{ background: "var(--content-card)", border: "1px solid var(--content-line)", borderRadius: 10, padding: "28px 24px" }}>
              <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>Send a message</p>
              {sent ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>✉️</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, color: "var(--content-text)", marginBottom: 8 }}>Message sent!</p>
                  <p style={{ fontSize: 13, color: "var(--content-sub)" }}>Thanks for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="btn-outline" style={{ marginTop: 20 }}>Send another</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    {["name", "email"].map(field => (
                      <div key={field}>
                        <label style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{field}</label>
                        <input type={field === "email" ? "email" : "text"} placeholder={field === "name" ? "Your name" : "your@email.com"} value={formState[field]} onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))} className="field" />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--content-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Message</label>
                    <textarea placeholder="What's on your mind?" rows={5} value={formState.message} onChange={e => setFormState(f => ({ ...f, message: e.target.value }))} className="field" style={{ resize: "vertical" }} />
                  </div>
                  {sendError && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{sendError}</p>}
                  <button onClick={handleSubmit} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Send Message →
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "24px 56px", borderTop: "1px solid var(--content-line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--content-muted)" }}>Yash Patil · © 2026</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--content-muted)" }}>Java Backend Developer · Built with React</span>
          <div style={{ display: "flex", gap: 14 }}>
            {[{ icon: GH, url: "https://github.com/yashpatil1816" }, { icon: LI, url: "https://www.linkedin.com/in/yash-patil-39941a326/" }, { icon: EM, url: "mailto:yashpatil2571@gmail.com" }].map((c, i) => (
              <a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                style={{ color: "var(--content-muted)", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--content-text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--content-muted)"}>
                {c.icon}
              </a>
            ))}
          </div>
        </footer>
      </main>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.94, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }} onClick={e => e.stopPropagation()}
              style={{ background: "var(--content-card)", border: "1px solid var(--content-line)", borderRadius: 12, padding: "clamp(20px,4vw,36px)", maxWidth: 580, width: "100%", maxHeight: "85vh", overflowY: "auto", position: "relative" }}>
              <button onClick={() => setModal(null)} style={{ position: "absolute", top: 14, right: 14, background: "var(--content-bg)", border: "1px solid var(--content-line)", borderRadius: 6, width: 30, height: 30, cursor: "pointer", color: "var(--content-sub)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✕</button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)" }}>{modal.num} · {modal.status}</span>
                <span className="tag">{modal.tag}</span>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,3vw,30px)", fontWeight: 500, marginBottom: 16, color: "var(--content-text)" }}>{modal.title}</h3>
              <p style={{ fontSize: 14, color: "var(--content-sub)", lineHeight: 1.85, marginBottom: 20 }}>{modal.detail}</p>
              <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--content-muted)", marginBottom: 10 }}>Architecture: {modal.arch}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                {modal.tech.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <a href={modal.github} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: "inline-flex" }}>
                {GH} View on GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}