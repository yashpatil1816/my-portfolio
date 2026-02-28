import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap');

    :root {
      --bg:     #fafaf8;
      --bg2:    #f3f2ef;
      --card:   #ffffff;
      --line:   #e5e3de;
      --text:   #1a1917;
      --sub:    #6b6860;
      --muted:  #a09d97;
      --accent: #2563eb;
      --green:  #16a34a;
      --serif:  'Playfair Display', Georgia, serif;
      --sans:   'DM Sans', sans-serif;
      --mono:   'DM Mono', monospace;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: var(--sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }
    a { text-decoration: none; color: inherit; }
    ::selection { background: rgba(37,99,235,0.12); }

    .wrap { max-width: 1100px; margin: 0 auto; padding: 0 48px; }
    @media (max-width: 768px) { .wrap { padding: 0 20px; } }

    .section { padding: 96px 0; }
    @media (max-width: 768px) { .section { padding: 60px 0; } }

    .nav-links { display: flex; align-items: center; gap: 36px; }
    .nav-ham { display: none; }
    @media (max-width: 700px) { .nav-links { display: none; } .nav-ham { display: flex !important; } }

    .hero-grid { display: grid; grid-template-columns: 1fr 360px; gap: 80px; align-items: center; min-height: calc(100vh - 68px); padding: 60px 0 80px; }
    @media (max-width: 960px) { .hero-grid { grid-template-columns: 1fr; gap: 48px; padding: 48px 0 64px; } .hero-right { order: -1; } }

    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
    @media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } }

    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
    @media (max-width: 860px) { .skills-grid { grid-template-columns: 1fr; gap: 40px; } }

    .proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; border: 1px solid var(--line); }
    @media (max-width: 700px) { .proj-grid { grid-template-columns: 1fr; } }

    .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 64px; }
    @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; gap: 40px; } }

    .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    @media (max-width: 600px) { .footer-inner { flex-direction: column; text-align: center; } }

    .field { width: 100%; padding: 11px 14px; background: var(--bg); border: 1px solid var(--line); border-radius: 6px; font-family: var(--sans); font-size: 13px; color: var(--text); outline: none; transition: border-color 0.18s; }
    .field:focus { border-color: var(--accent); }
    .field::placeholder { color: var(--muted); }

    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: var(--text); color: var(--bg); font-family: var(--sans); font-size: 13px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.18s, transform 0.15s; }
    .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }

    .btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: transparent; color: var(--sub); font-family: var(--sans); font-size: 13px; font-weight: 500; border: 1px solid var(--line); border-radius: 6px; cursor: pointer; transition: all 0.18s; }
    .btn-outline:hover { border-color: var(--text); color: var(--text); transform: translateY(-1px); }

    .tag { display: inline-block; font-family: var(--mono); font-size: 11px; padding: 3px 9px; background: var(--bg2); border: 1px solid var(--line); border-radius: 4px; color: var(--sub); }

    .skill-track { height: 2px; background: var(--line); border-radius: 1px; overflow: hidden; margin-top: 8px; }
    .skill-fill { height: 100%; background: var(--text); border-radius: 1px; transition: width 1.2s cubic-bezier(0.22,1,0.36,1); }

    @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
  `}</style>
);

const Typewriter = ({ words, speed = 70, pause = 2200 }) => {
  const [idx, setIdx] = useState(0), [sub, setSub] = useState(0), [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[idx];
    const t = del
      ? setTimeout(() => { setSub(s => s - 1); if (sub <= 1) { setDel(false); setIdx(i => (i + 1) % words.length); } }, 30)
      : sub < word.length ? setTimeout(() => setSub(s => s + 1), speed)
      : setTimeout(() => setDel(true), pause);
    return () => clearTimeout(t);
  }, [idx, sub, del, words, speed, pause]);
  return <><span style={{ color: "var(--accent)" }}>{words[idx].slice(0, sub)}</span><span style={{ animation: "blink 1s step-end infinite", color: "var(--accent)" }}>|</span></>;
};

const SectionHeader = ({ label, title }) => (
  <div style={{ marginBottom: 52 }}>
    <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>{label}</p>
    <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "var(--text)", lineHeight: 1.15 }}>{title}</h2>
    <div style={{ width: 36, height: 2, background: "var(--text)", borderRadius: 1, marginTop: 14, opacity: 0.15 }} />
  </div>
);

const SkillBar = ({ name, level, delay }) => {
  const [w, setW] = useState(0); const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setW(level), delay); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, [level, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{name}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{level}%</span>
      </div>
      <div className="skill-track"><div className="skill-fill" style={{ width: `${w}%` }} /></div>
    </div>
  );
};

const Counter = ({ to, suffix, label }) => {
  const [n, setN] = useState(0); const ref = useRef(); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.5 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  useEffect(() => { if (!vis) return; let s = 0; const step = to / 50; const t = setInterval(() => { s += step; if (s >= to) { setN(to); clearInterval(t); } else setN(s); }, 18); return () => clearInterval(t); }, [vis, to]);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "28px 16px" }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, color: "var(--text)" }}>
        {Number.isInteger(to) ? Math.round(n) : parseFloat(n).toFixed(2)}{suffix}
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginTop: 6, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const WeatherWidget = () => {
  const [input, setInput] = useState(""), [data, setData] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const fetch_ = useCallback(async (q) => {
    if (!q.trim()) return; setLoading(true); setError(""); setData(null);
    try { const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`); if (!res.ok) throw new Error("City not found"); setData(await res.json()); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch_("Pune"); }, []);
  const icon = (m = "") => { m = m.toLowerCase(); if (m.includes("clear")) return "☀️"; if (m.includes("cloud")) return "⛅"; if (m.includes("rain")) return "🌧️"; return "🌡️"; };
  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 8, padding: 14, marginTop: 10 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && fetch_(input)} placeholder="Search city..." className="field" style={{ flex: 1 }} />
        <button onClick={() => fetch_(input)} className="btn-primary" style={{ padding: "11px 14px" }}>Go</button>
      </div>
      {loading && <p style={{ fontSize: 12, color: "var(--muted)" }}>Loading...</p>}
      {error && <p style={{ fontSize: 12, color: "#dc2626" }}>{error}</p>}
      {data && !loading && (
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 30 }}>{icon(data.weather[0]?.main)}</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13 }}>{data.name}, {data.sys.country}</p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 700 }}>{Math.round(data.main.temp)}°C</p>
            <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize" }}>{data.weather[0]?.description} · {data.main.humidity}% humidity</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PROJECTS = [
  { title: "CineReserve", emoji: "🎬", tag: "REST API", description: "Production-grade movie ticket booking backend with JWT auth, real-time seat availability, and role-based access control.", tech: ["Java", "Spring Boot", "MySQL", "JPA/Hibernate", "JWT", "Spring Security"], detail: "Designed and built a modular RESTful backend for movie ticket booking. Enforced stateless JWT authentication and role-based authorization (Admin/User). Built APIs for movie management, show scheduling, seat selection, booking workflows, and real-time seat validation.", arch: "Controller – Service – Repository", github: "https://github.com/yashpatil1816" },
  { title: "ShopSphere", emoji: "🛒", tag: "Microservices", description: "5-service microservices e-commerce platform with API Gateway, load balancing, JWT RBAC, and event-driven messaging.", tech: ["Java", "Spring Boot", "Spring Cloud", "JWT", "API Gateway", "Kafka"], detail: "Engineered a production microservices platform: user, product, order, payment, notification services — each with its own isolated database. API Gateway for routing and load balancing. Event-driven cross-service messaging for eventual consistency.", arch: "Microservices + API Gateway", github: "https://github.com/yashpatil1816" },
  { title: "WeatherSphere", emoji: "🌦️", tag: "API Integration", description: "Real-time weather data proxy service integrating OpenWeatherMap REST API — routing, transformation, and error handling.", tech: ["Java", "Spring Boot", "REST API", "OpenWeatherMap", "HTTP Client"], detail: "Spring Boot service acting as a proxy to OpenWeatherMap REST API. Handles request routing, response transformation, error management, and JSON deserialization.", arch: "API Proxy + Transform", isWeather: true, github: "https://github.com/yashpatil1816" },
  { title: "J.P. Morgan Simulation", emoji: "🏦", tag: "Virtual Experience", description: "Software engineering simulation: Apache Kafka for async messaging, 4+ REST endpoints, JPA entities with H2 database.", tech: ["Java", "Spring Boot", "Apache Kafka", "Spring Data JPA", "H2"], detail: "Completed J.P. Morgan Chase & Co. Software Engineering Virtual Experience on Forage. Back-end development with Java + Spring Boot. Apache Kafka for async message processing between 2 services.", arch: "Event-Driven Services", github: "https://github.com/yashpatil1816" },
];

const SKILLS = [
  { name: "Java", level: 90 }, { name: "Spring Boot / Spring Security", level: 87 },
  { name: "REST APIs & Architecture", level: 85 }, { name: "Spring Data JPA / Hibernate", level: 83 },
  { name: "SQL & Database Design", level: 80 }, { name: "Microservices & Spring Cloud", level: 76 },
  { name: "Apache Kafka", level: 72 }, { name: "DSA & Problem Solving", level: 78 },
];

const TECHS = ["Java", "Spring Boot", "Apache Kafka", "REST API", "JPA / Hibernate", "Spring Security", "JWT Auth", "MySQL", "Spring Cloud", "Microservices", "Git / Maven", "Postman"];

const GH = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const LI = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const EM = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>;
const PH = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.34 6.34l1.47-1.47a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;

export default function App() {
  const [modal, setModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const { scrollYProgress } = useScroll();

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenu(false); };

  const handleSubmit = async () => {
    if (!formState.name || !formState.email || !formState.message) { setSendError("Please fill in all fields."); return; }
    setSending(true); setSendError("");
    try {
      const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
      const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`);
      window.location.href = `mailto:yashpatil2571@gmail.com?subject=${subject}&body=${body}`;
      setSent(true); setFormState({ name: "", email: "", message: "" });
    } catch { setSendError("Something went wrong."); } finally { setSending(false); }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <GlobalStyle />
      <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "var(--accent)", transformOrigin: "left", scaleX: scrollYProgress, zIndex: 1000 }} />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(250,250,248,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--line)" }}>
              <img src="/profile.jpg" alt="YP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%" }} />
            </div>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Yash Patil</span>
          </div>

          <div className="nav-links">
            {["About", "Skills", "Projects", "Contact"].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: "var(--sub)", padding: 0, transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = "var(--text)"} onMouseLeave={e => e.target.style.color = "var(--sub)"}>{l}</button>
            ))}
            <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }}>↓ Resume</a>
          </div>

          <button className="nav-ham" onClick={() => setMobileMenu(m => !m)}
            style={{ display: "none", background: "none", border: "1px solid var(--line)", borderRadius: 6, padding: "7px 10px", cursor: "pointer", flexDirection: "column", gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 1.5, background: "var(--text)", borderRadius: 1, transition: "all 0.2s", transform: mobileMenu ? (i===0?"rotate(45deg) translate(3.5px,3.5px)":i===2?"rotate(-45deg) translate(3.5px,-3.5px)":"scaleX(0)"):"none" }} />)}
          </button>
        </div>

        {mobileMenu && (
          <div style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {["About", "Skills", "Projects", "Contact"].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, color: "var(--sub)", textAlign: "left", padding: 0 }}>{l}</button>
            ))}
            <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-primary" style={{ width: "fit-content" }}>↓ Resume</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 64 }}>
        <div className="wrap hero-grid">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "5px 12px", background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2.5s infinite" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", letterSpacing: "0.06em" }}>Available for opportunities</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              style={{ fontFamily: "var(--serif)", fontSize: "clamp(44px,7vw,76px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 14, color: "var(--text)" }}>
              Yash Patil
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              style={{ fontFamily: "var(--mono)", fontSize: "clamp(12px,1.6vw,14px)", color: "var(--sub)", marginBottom: 22, minHeight: 22 }}>
              <Typewriter words={["Java Backend Developer", "Spring Boot Engineer", "Microservices Architect", "REST API Specialist"]} />
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
              Building scalable RESTful APIs and microservices with Spring Boot. Focused on clean architecture and backend systems that hold up at scale.
              <br /><span style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, display: "block", fontFamily: "var(--mono)" }}>B.Tech IT · G.H. Raisoni College, Pune · CGPA 8.18/10</span>
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-primary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
              </a>
              <button onClick={() => scrollTo("contact")} className="btn-outline">Let's Talk →</button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              style={{ display: "flex", gap: 40, paddingTop: 28, borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
              {[{ n: "4+", l: "Projects" }, { n: "5", l: "Microservices" }, { n: "100+", l: "DSA Solved" }, { n: "8.18", l: "CGPA / 10" }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,2.8vw,30px)", fontWeight: 700, color: "var(--text)" }}>{s.n}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginTop: 3, textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div className="hero-right" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>

            <div style={{ position: "relative" }}>
              <div style={{ width: 200, height: 200, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--line)" }}>
                <img src="/profile.jpg" alt="Yash Patil" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%" }} />
              </div>
              <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderRadius: "50%", background: "var(--green)", border: "3px solid var(--bg)" }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {[{ url: "https://github.com/yashpatil1816", icon: GH }, { url: "https://www.linkedin.com/in/yash-patil-39941a326/", icon: LI }, { url: "mailto:yashpatil2571@gmail.com", icon: EM }].map((c, i) => (
                <a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--sub)"; e.currentTarget.style.transform = "none"; }}>
                  {c.icon}
                </a>
              ))}
            </div>

            {/* Certs */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🏅", label: "Oracle · 2025", title: "Cloud Infrastructure AI Foundations" },
                { icon: "📜", label: "Udemy · Feb 2026", title: "Spring, Spring Boot, MVC & Hibernate" },
                { icon: "📜", label: "Code For Success · Oct 2025", title: "Java Full Stack Development Program" },
              ].map((c, i) => (
                <div key={i} style={{ padding: "11px 14px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--card)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{c.label}</p>
                    <p style={{ fontSize: 11, color: "var(--sub)", lineHeight: 1.4 }}>{c.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
              {[{ label: "Role", value: "Java Backend Developer" }, { label: "Location", value: "Pune, India" }, { label: "Education", value: "B.Tech IT, 2027" }, { label: "Status", value: "Open to Work ✓" }].map((row, i) => (
                <div key={row.label} style={{ display: "flex", padding: "10px 14px", gap: 12, alignItems: "center", borderBottom: i < 3 ? "1px solid var(--line)" : "none", background: i % 2 === 0 ? "var(--card)" : "var(--bg2)" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", width: 70, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: row.label === "Status" ? "var(--green)" : "var(--sub)", fontWeight: row.label === "Status" ? 600 : 400 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section" style={{ background: "var(--bg2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHeader label="01 — About" title="Backends Built for Production" />
          <div className="about-grid">
            <div>
              <p style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.9, marginBottom: 16 }}>Java Backend Developer with hands-on experience building scalable microservices and RESTful APIs with Spring Boot. Proficient in JWT-based auth, third-party API integration, and layered architecture design.</p>
              <p style={{ fontSize: 15, color: "var(--sub)", lineHeight: 1.9, marginBottom: 28 }}>Strong foundation in relational database modeling, OOP principles, system design, and DSA. Pursuing B.Tech in Information Technology at G.H. Raisoni College of Engineering, Pune — CGPA 8.18/10, Expected 2027.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {["OOP", "REST", "Microservices", "JWT", "Spring Security", "DSA", "JPA", "Kafka", "MySQL", "Git"].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "var(--card)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {[{ to: 4, s: "+", l: "Projects" }, { to: 5, s: "", l: "Microservices" }, { to: 100, s: "+", l: "DSA Problems" }, { to: 8.18, s: "/10", l: "CGPA" }].map((s, i) => (
                  <div key={i} style={{ borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none", borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
                    <Counter to={s.to} suffix={s.s} label={s.l} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHeader label="02 — Skills" title="Tech Stack" />
          <div className="skills-grid">
            <div>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Technologies</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TECHS.map(t => <span key={t} className="tag" style={{ fontSize: 12 }}>{t}</span>)}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Proficiency</p>
              {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 80} />)}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section" style={{ background: "var(--bg2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHeader label="03 — Projects" title="My Projects" />
          <div className="proj-grid">
            {PROJECTS.map((p, i) => (
              <motion.div key={p.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                onClick={() => setModal(p)}
                style={{ padding: "28px 24px", background: "var(--card)", cursor: "pointer", borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none", transition: "background 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--card)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span style={{ fontSize: 26 }}>{p.emoji}</span>
                  <span className="tag">{p.tag}</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.75, marginBottom: 16 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                  {p.tech.map(t => <span key={t} className="tag" style={{ fontSize: 10 }}>{t}</span>)}
                </div>
                <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>View details →</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHeader label="04 — Contact" title="Let's Connect" />
          <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 44, maxWidth: 480 }}>Open to Java Backend, SWE & Internship opportunities. Messages go directly to my inbox.</p>
          <div className="contact-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "GitHub", handle: "yashpatil1816", url: "https://github.com/yashpatil1816", icon: GH },
                { label: "LinkedIn", handle: "yash-patil-39941a326", url: "https://www.linkedin.com/in/yash-patil-39941a326/", icon: LI },
                { label: "Email", handle: "yashpatil2571@gmail.com", url: "mailto:yashpatil2571@gmail.com", icon: EM },
                { label: "Phone", handle: "+91 9022046356", url: "tel:+919022046356", icon: PH },
              ].map((c, i) => (
                <motion.a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 8, transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg2)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)", flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{c.label}</p>
                    <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{c.handle}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "28px 24px" }}>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Send a message</p>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Message sent!</p>
                  <p style={{ fontSize: 13, color: "var(--sub)" }}>Thanks for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="btn-outline" style={{ marginTop: 20 }}>Send another</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    {["name", "email"].map(field => (
                      <div key={field}>
                        <label style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{field}</label>
                        <input type={field === "email" ? "email" : "text"} placeholder={field === "name" ? "Your name" : "your@email.com"} value={formState[field]} onChange={e => setFormState(f => ({ ...f, [field]: e.target.value }))} className="field" />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Message</label>
                    <textarea placeholder="What's on your mind?" rows={5} value={formState.message} onChange={e => setFormState(f => ({ ...f, message: e.target.value }))} className="field" style={{ resize: "vertical" }} />
                  </div>
                  {sendError && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{sendError}</p>}
                  <button onClick={handleSubmit} className="btn-primary" disabled={sending} style={{ width: "100%", justifyContent: "center", opacity: sending ? 0.7 : 1 }}>
                    {sending ? "Sending..." : "Send Message →"}
                  </button>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center", fontFamily: "var(--mono)" }}>→ yashpatil2571@gmail.com</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "24px 0", background: "var(--bg)" }}>
        <div className="wrap footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--line)" }}>
              <img src="/profile.jpg" alt="YP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%" }} />
            </div>
            <span style={{ fontSize: 13, color: "var(--sub)" }}>Yash Patil · © 2026</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>Java Backend Developer · Built with React</span>
          <div style={{ display: "flex", gap: 14 }}>
            {[{ icon: GH, url: "https://github.com/yashpatil1816" }, { icon: LI, url: "https://www.linkedin.com/in/yash-patil-39941a326/" }, { icon: EM, url: "mailto:yashpatil2571@gmail.com" }].map((c, i) => (
              <a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                style={{ color: "var(--muted)", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"} onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
                {c.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}
              style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "clamp(20px,4vw,36px)", maxWidth: 580, width: "100%", maxHeight: "85vh", overflowY: "auto", position: "relative" }}>
              <button onClick={() => setModal(null)} style={{ position: "absolute", top: 14, right: 14, background: "var(--bg2)", border: "1px solid var(--line)", borderRadius: 6, width: 30, height: 30, cursor: "pointer", color: "var(--sub)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✕</button>
              <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{modal.emoji}</span>
              <span className="tag" style={{ marginBottom: 14, display: "inline-block" }}>{modal.tag}</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, marginBottom: 12, marginTop: 6, color: "var(--text)" }}>{modal.title}</h3>
              <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.85, marginBottom: 18 }}>{modal.detail}</p>
              {modal.isWeather && (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Live Demo</p>
                  <WeatherWidget />
                </div>
              )}
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Architecture: {modal.arch}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
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