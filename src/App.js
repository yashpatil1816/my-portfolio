import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');

    :root {
      --sb: #0a0908;
      --sb2: #111009;
      --sb-border: #1e1c18;
      --sb-text: #ede8df;
      --sb-sub: #7a7468;
      --sb-muted: #3a3830;
      --gold: #c8a96e;
      --gold2: #a8893e;
      --green: #2d7a4f;
      --ct-bg: #f8f5f0;
      --ct-card: #ffffff;
      --ct-text: #18160f;
      --ct-sub: #6b6455;
      --ct-muted: #a09880;
      --ct-line: #e8e2d8;
      --serif: 'Libre Baskerville', Georgia, serif;
      --sans: 'Inter', sans-serif;
      --mono: 'DM Mono', monospace;
      --sw: 300px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--sb); color: var(--ct-text); font-family: var(--sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--gold2); border-radius: 1px; }
    a { text-decoration: none; color: inherit; }
    ::selection { background: rgba(200,169,110,0.18); }

    #particle-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

    .layout { display: flex; min-height: 100vh; position: relative; z-index: 1; }

    .sidebar {
      width: var(--sw); min-width: var(--sw);
      background: rgba(10,9,8,0.97);
      border-right: 1px solid var(--sb-border);
      position: fixed; top: 0; left: 0; bottom: 0;
      display: flex; flex-direction: column;
      padding: 36px 24px; overflow-y: auto; z-index: 50;
      backdrop-filter: blur(20px);
    }

    .content { margin-left: var(--sw); flex: 1; min-height: 100vh; }

    .section { padding: 80px 60px; border-bottom: 1px solid var(--ct-line); position: relative; overflow: hidden; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 7px; cursor: pointer;
      transition: all 0.2s; color: var(--sb-sub);
      background: transparent; border: none;
      font-family: var(--sans); font-size: 13px; font-weight: 400;
      width: 100%; text-align: left; margin-bottom: 2px; letter-spacing: 0.01em;
    }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--sb-text); }
    .nav-item.active { background: rgba(200,169,110,0.08); color: var(--sb-text); border-left: 2px solid var(--gold); padding-left: 10px; }
    .nav-num { font-family: var(--mono); font-size: 9px; color: var(--gold); width: 18px; flex-shrink: 0; }

    .tag { display: inline-block; font-family: var(--mono); font-size: 10px; padding: 3px 8px; background: transparent; border: 1px solid var(--ct-line); border-radius: 3px; color: var(--ct-sub); }

    .skill-track { height: 1px; background: var(--ct-line); border-radius: 1px; overflow: hidden; margin-top: 8px; }
    .skill-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 1px; transition: width 1.4s cubic-bezier(0.22,1,0.36,1); }

    .tilt-card {
      background: var(--ct-card); border: 1px solid var(--ct-line);
      border-radius: 10px; padding: 24px; cursor: pointer; margin-bottom: 14px;
      transform-style: preserve-3d; will-change: transform;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .tilt-card:hover { border-color: var(--gold); box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(200,169,110,0.12); }

    .field { width: 100%; padding: 11px 14px; background: var(--ct-bg); border: 1px solid var(--ct-line); border-radius: 6px; font-family: var(--sans); font-size: 13px; color: var(--ct-text); outline: none; transition: border-color 0.2s; }
    .field:focus { border-color: var(--gold); }
    .field::placeholder { color: var(--ct-muted); }

    .btn-dark { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: var(--ct-text); color: #f8f5f0; font-family: var(--sans); font-size: 13px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.18s, transform 0.15s; }
    .btn-dark:hover { opacity: 0.85; transform: translateY(-1px); }

    .btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: transparent; color: var(--ct-sub); font-family: var(--sans); font-size: 13px; font-weight: 400; border: 1px solid var(--ct-line); border-radius: 6px; cursor: pointer; transition: all 0.18s; }
    .btn-outline:hover { border-color: var(--ct-text); color: var(--ct-text); transform: translateY(-1px); }

    .btn-gold { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--gold); color: var(--sb); font-family: var(--sans); font-size: 12px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.18s, transform 0.15s; }
    .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }

    .exp-card { background: var(--ct-card); border: 1px solid var(--ct-line); border-left: 3px solid var(--gold); border-radius: 0 10px 10px 0; padding: 24px; margin-bottom: 14px; }

    .contact-link { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 16px; background: var(--ct-card); border: 1px solid var(--ct-line); border-radius: 8px; transition: all 0.18s; margin-bottom: 8px; }
    .contact-link:hover { border-color: var(--gold); transform: translateX(4px); }

    .marquee-wrap { overflow: hidden; border-top: 1px solid var(--ct-line); border-bottom: 1px solid var(--ct-line); padding: 14px 0; background: var(--ct-card); }
    .marquee-track { display: flex; animation: marquee 32s linear infinite; white-space: nowrap; }
    .marquee-track span { font-family: var(--mono); font-size: 11px; color: var(--ct-muted); padding: 0 28px; letter-spacing: 0.12em; }
    .marquee-track span.acc { color: var(--gold); }
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

    @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.25} }
    @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none} }
    @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }

    .div-line { height: 1px; background: var(--sb-border); margin: 18px 0; }

    @media (max-width: 960px) {
      :root { --sw: 0px; }
      .sidebar { display: none; }
      .content { margin-left: 0; }
      .mobile-header { display: flex !important; }
      .section { padding: 52px 22px; }
      .hero-grid { grid-template-columns: 1fr !important; }
      .about-grid { grid-template-columns: 1fr !important; }
      .skills-grid { grid-template-columns: 1fr !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
    }

    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,9,8,0.97); padding: 0 20px; height: 56px; border-bottom: 1px solid var(--sb-border); backdrop-filter: blur(20px); align-items: center; justify-content: space-between; }

    .mob-menu-panel { position: fixed; top: 0; left: 0; bottom: 0; z-index: 95; width: 280px; background: var(--sb); border-right: 1px solid var(--sb-border); padding: 72px 20px 40px; overflow-y: auto; animation: slideIn 0.22s ease; }
    .mob-overlay { position: fixed; inset: 0; z-index: 90; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); }

    .mob-bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: rgba(10,9,8,0.97); border-top: 1px solid var(--sb-border); backdrop-filter: blur(20px); padding: 6px 0 env(safe-area-inset-bottom,6px); }
    .mob-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; background: none; border: none; cursor: pointer; padding: 5px 2px; color: var(--sb-sub); font-family: var(--mono); font-size: 8px; transition: color 0.18s; }
    .mob-btn.active { color: var(--gold); }

    @media (max-width: 960px) { .mob-bottom-nav { display: flex; } .content { padding-bottom: 60px; } }
    @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
  `}</style>
);

const ParticleCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mouse = { x: W / 2, y: H / 2 };
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.2 + 0.3, opacity: Math.random() * 0.5 + 0.1,
    }));
    const onMouse = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) { p.vx += dx / dist * 0.012; p.vy += dy / dist * 0.012; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(200,169,110,${0.055 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas id="particle-canvas" ref={ref} />;
};

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
  return <><span style={{ color: "var(--gold)" }}>{words[idx].slice(0, sub)}</span><span style={{ animation: "blink 1s step-end infinite", color: "var(--gold)" }}>|</span></>;
};

const TiltCard = ({ children, onClick, highlight }) => {
  const ref = useRef();
  const onMove = e => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)"; };
  return (
    <div ref={ref} className="tilt-card" onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      style={{ borderLeft: highlight ? "3px solid var(--gold)" : "1px solid var(--ct-line)", borderRadius: highlight ? "0 10px 10px 0" : "10px", transition: "transform 0.18s ease, border-color 0.2s, box-shadow 0.2s" }}>
      {children}
    </div>
  );
};

const SkillBar = ({ name, level, delay }) => {
  const [w, setW] = useState(0); const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setW(level), delay); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, [level, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--ct-sub)" }}>{name}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ct-muted)" }}>{level}%</span>
      </div>
      <div className="skill-track"><div className="skill-fill" style={{ width: `${w}%` }} /></div>
    </div>
  );
};

const ParallaxSection = ({ children, id, className, style }) => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  return (
    <section ref={ref} id={id} className={`section ${className || ""}`} style={style}>
      <motion.div style={{ position: "absolute", inset: 0, y, zIndex: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 80% 20%, rgba(200,169,110,0.03) 0%, transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
};

const SH = ({ num, label, title }) => (
  <div style={{ marginBottom: 44 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)" }}>{num} —</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{label}</span>
    </div>
    <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "var(--ct-text)", lineHeight: 1.1, letterSpacing: "-0.5px" }}>{title}</h2>
    <div style={{ width: 32, height: 1, background: "var(--gold)", marginTop: 14, opacity: 0.6 }} />
  </div>
);

const GH = <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const LI = <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const EM = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>;
const PH = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.34 6.34l1.47-1.47a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const ARR = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>;

const PROJECTS = [
  { num:"01", status:"ONGOING", tag:"DISTRIBUTED SYSTEMS", title:"TicketFlow", description:"Distributed ticket booking handling 5K+ concurrent users with sub-200ms latency. Redis seat locking, Kafka async pipelines, JWT RBAC security.", tech:["Spring Boot","MySQL","Redis","Kafka","JWT"], metrics:["5K users","<200ms"], detail:"Designed a distributed ticket booking system handling 5K+ concurrent users. Implemented Redis-based distributed seat locking (SET NX + TTL 10 min) to prevent race conditions. Built event-driven architecture using Apache Kafka for booking and notification services. Secured APIs using stateless JWT authentication with RBAC and BCrypt encryption.", arch:"Event-Driven Microservices", github:"https://github.com/yashpatil1816", highlight:true },
  { num:"02", status:"BUILT", tag:"AGENTIC AI", title:"Transaction Insight Engine", description:"Real-time UPI fraud detection. 4-rule engine auto-routes 85% of transactions. LangChain4j agentic loop handles uncertain cases in <100ms.", tech:["Java 17","Kafka","LangChain4j","Redis","Spring AI","JWT"], metrics:["<100ms","85% routed"], detail:"Designed a real-time fraud detection pipeline using Kafka for async event streaming and Redis for per-user transaction caching. Built a 4-rule deterministic engine (amount spike, rapid-fire, new location, new device). Integrated LangChain4j agentic loop for uncertain cases with step-by-step reasoning, tool calls, and MySQL audit logs.", arch:"Agentic AI + Event-Driven", github:"https://github.com/yashpatil1816" },
  { num:"03", status:"JAN 2025", tag:"VIRTUAL · FORAGE", title:"J.P. Morgan SWE", description:"Software engineering simulation: Java + Spring Boot REST APIs, Apache Kafka async messaging, JPA entities with H2 database.", tech:["Java","Spring Boot","Apache Kafka","JPA","H2"], metrics:["REST APIs","Kafka"], detail:"Completed J.P. Morgan Chase & Co. Software Engineering Virtual Experience on Forage. Developed backend services using Java and Spring Boot. Integrated Apache Kafka for asynchronous communication. Applied Controller–Service–Repository layered architecture for clean modular design.", arch:"Controller – Service – Repository", github:"https://github.com/yashpatil1816" },
  { num:"04", status:"2024", tag:"API INTEGRATION", title:"WeatherSphere", description:"Real-time weather data proxy service integrating OpenWeatherMap REST API — routing, transformation, and error handling.", tech:["Java","Spring Boot","REST API","OpenWeatherMap"], metrics:["Live API","Proxy"], detail:"Spring Boot service acting as a proxy to OpenWeatherMap REST API. Handles request routing, response transformation, error management, and JSON deserialization.", arch:"API Proxy + Transform", github:"https://github.com/yashpatil1816" },
];

const SKILLS = [
  { name:"Java", level:90 }, { name:"Spring Boot / Spring Security", level:87 },
  { name:"REST APIs & Architecture", level:85 }, { name:"Spring Data JPA / Hibernate", level:83 },
  { name:"SQL & Database Design", level:80 }, { name:"Apache Kafka", level:75 },
  { name:"Redis & Distributed Systems", level:72 }, { name:"LangChain4j / Spring AI", level:68 },
  { name:"DSA & Problem Solving", level:80 },
];

const SKILL_CATS = [
  { label:"LANGUAGES", items:["Java","JavaScript","SQL","Python"] },
  { label:"FRAMEWORKS", items:["Spring Boot","Spring Security","Spring Data JPA","Hibernate"] },
  { label:"INFRASTRUCTURE", items:["Apache Kafka","Redis","Docker","Jenkins","GitHub Actions"] },
  { label:"DATABASES", items:["MySQL","H2","Redis Cache"] },
  { label:"AI / ML", items:["LangChain4j","Spring AI","Generative AI"] },
  { label:"TESTING", items:["JUnit","TestNG","Postman","API Testing"] },
  { label:"CONCEPTS", items:["Microservices","REST APIs","CI/CD","Distributed Systems","Event-Driven","JWT & RBAC"] },
];

const CERTS = [
  { icon:"🏅", label:"Oracle Cloud Infrastructure · 2025", title:"AI Foundations Associate" },
  { icon:"📜", label:"Udemy · Feb 2026", title:"Spring, Spring Boot, MVC & Hibernate" },
  { icon:"📜", label:"Code For Success · Oct 2025", title:"Java Full Stack Development" },
];

const NAV = [
  {id:"home",label:"Home",num:"00"},{id:"about",label:"About",num:"01"},
  {id:"skills",label:"Skills",num:"02"},{id:"projects",label:"Projects",num:"03"},
  {id:"experience",label:"Experience",num:"04"},{id:"contact",label:"Contact",num:"05"},
];

const MARQUEE = ["Java","Spring Boot","Apache Kafka","Redis","Microservices","REST APIs","JWT & RBAC","LangChain4j","Spring AI","Distributed Systems","JPA / Hibernate","Spring Security","MySQL","Docker","CI/CD","Event-Driven","Java","Spring Boot","Apache Kafka","Redis","Microservices","REST APIs","JWT & RBAC","LangChain4j","Spring AI","Distributed Systems","JPA / Hibernate","Spring Security","MySQL","Docker","CI/CD","Event-Driven"];

const SidebarContent = ({ active, scrollTo }) => (
  <>
    <div style={{ marginBottom: 28 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--sb-border)", marginBottom: 14, animation: "float 4s ease-in-out infinite" }}>
        <img src="/profile.jpg" alt="Yash Patil" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2.5s infinite", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", letterSpacing: "0.07em" }}>Available for opportunities</span>
      </div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, color: "var(--sb-text)", lineHeight: 1.05, marginBottom: 5 }}>
        Yash<br /><span style={{ color: "var(--gold)", fontStyle: "italic", fontWeight: 400 }}>Patil</span>
      </h1>
      <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--sb-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Java Backend Developer</p>
    </div>
    <div className="div-line" />
    <p style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--sb-muted)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10, paddingLeft: 12 }}>Navigation</p>
    {NAV.map(n => (
      <button key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>
        <span className="nav-num">{n.num}</span>
        {n.label}
        {active === n.id && <span style={{ marginLeft: "auto", width: 16, height: 1, background: "var(--gold)", display: "block" }} />}
      </button>
    ))}
    <div className="div-line" />
    <p style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--sb-muted)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Links</p>
    {[
      { label:"GitHub — yashpatil1816", url:"https://github.com/yashpatil1816" },
      { label:"LinkedIn", url:"https://www.linkedin.com/in/yash-patil-39941a326/" },
      { label:"yashpatil2571@gmail.com", url:"mailto:yashpatil2571@gmail.com" },
      { label:"LeetCode — 200+ solved", url:"https://leetcode.com" },
    ].map((l, i) => (
      <a key={i} href={l.url} target={l.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--sb-sub)", padding: "4px 2px", transition: "color 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--sb-text)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--sb-sub)"}>
        <span style={{ color: "var(--sb-muted)", fontSize: 10 }}>›</span> {l.label}
      </a>
    ))}
    <div style={{ marginTop: "auto", paddingTop: 24 }}>
      <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-gold" style={{ width: "100%", justifyContent: "center" }}>
        ↓ Download Resume
      </a>
    </div>
  </>
);

export default function App() {
  const [active, setActive] = useState("home");
  const [modal, setModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [formErr, setFormErr] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActive(id); setMobileMenu(false); };

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.25 });
    NAV.forEach(n => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) { setFormErr("Please fill in all fields."); return; }
    setFormErr("");
    const s = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const b = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:yashpatil2571@gmail.com?subject=${s}&body=${b}`;
    setSent(true); setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ background: "var(--sb)" }}>
      <GlobalStyle />
      <ParticleCanvas />
      <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "var(--gold)", transformOrigin: "left", scaleX, zIndex: 1000 }} />

      <div className="layout">
        <aside className="sidebar"><SidebarContent active={active} scrollTo={scrollTo} /></aside>

        {/* MOBILE HEADER */}
        <header className="mobile-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--sb-border)" }}>
              <img src="/profile.jpg" alt="YP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%" }} />
            </div>
            <div>
              <span style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--sb-text)", fontWeight: 700 }}>Yash Patil</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2.5s infinite" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--green)" }}>Available</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: 11, padding: "7px 12px" }}>Resume</a>
            <button onClick={() => setMobileMenu(m => !m)} style={{ background: "none", border: "1px solid var(--sb-border)", borderRadius: 6, padding: "7px 9px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 17, height: 1.5, background: "var(--sb-text)", borderRadius: 1, transition: "all 0.2s", transform: mobileMenu ? (i===0?"rotate(45deg) translate(3.5px,3.5px)":i===2?"rotate(-45deg) translate(3.5px,-3.5px)":"scaleX(0)"):"none" }} />)}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {mobileMenu && (
            <>
              <motion.div className="mob-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenu(false)} />
              <div className="mob-menu-panel"><SidebarContent active={active} scrollTo={scrollTo} /></div>
            </>
          )}
        </AnimatePresence>

        <nav className="mob-bottom-nav">
          {NAV.map(n => (
            <button key={n.id} className={`mob-btn ${active === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>
              <span style={{ fontSize: 14 }}>{n.num==="00"?"⌂":n.num==="01"?"◎":n.num==="02"?"◈":n.num==="03"?"◻":n.num==="04"?"◆":"◉"}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <main className="content">

          {/* ── HERO ── */}
          <ParallaxSection id="home" style={{ background: "#f8f5f0", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "clamp(80px,12vw,120px)" }}>
            <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 48, alignItems: "start", width: "100%" }}>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "5px 12px", background: "rgba(45,122,79,0.08)", border: "1px solid rgba(45,122,79,0.2)", borderRadius: 20 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2.5s infinite" }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", letterSpacing: "0.06em" }}>Open to opportunities</span>
                </motion.div>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(46px,7vw,80px)", fontWeight: 700, color: "var(--ct-text)", lineHeight: 1.0, letterSpacing: "-2px", marginBottom: 16 }}>
                  Backend<br /><em style={{ color: "var(--gold)", fontWeight: 400 }}>Engineer.</em><br />Problem<br />Solver.
                </h1>
                <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--ct-sub)", marginBottom: 24, minHeight: 22 }}>
                  <Typewriter words={["Java Backend Developer","Spring Boot Engineer","Distributed Systems","Agentic AI Builder","REST API Specialist"]} />
                </div>
                <p style={{ fontSize: 15, color: "var(--ct-sub)", lineHeight: 1.9, maxWidth: 500, marginBottom: 36 }}>
                  I build <strong style={{ color: "var(--ct-text)", fontWeight: 600 }}>distributed systems</strong> that scale — from <strong style={{ color: "var(--ct-text)", fontWeight: 600 }}>5K+ concurrent</strong> ticket bookings to <strong style={{ color: "var(--ct-text)", fontWeight: 600 }}>sub-100ms fraud detection</strong> with Agentic AI.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                  <button onClick={() => scrollTo("projects")} className="btn-dark">View Projects →</button>
                  <button onClick={() => scrollTo("contact")} className="btn-outline">Let's Connect</button>
                </div>
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", maxWidth: 380, border: "1px solid var(--ct-line)", borderRadius: 10, overflow: "hidden" }}>
                  {[{ n:"200+", l:"DSA Problems" }, { n:"8.18", l:"CGPA" }, { n:"2027", l:"Graduating" }].map((s, i) => (
                    <div key={i} style={{ background: "var(--ct-card)", padding: "16px 10px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--ct-line)" : "none" }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "var(--ct-text)" }}>{s.n}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "var(--ct-card)", border: "1px solid var(--ct-line)", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", background: "#faf8f4", borderBottom: "1px solid var(--ct-line)" }}>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Quick Info</p>
                  </div>
                  {[{ k:"Role", v:"Java Backend Dev" }, { k:"Location", v:"Pune, India" }, { k:"Education", v:"B.Tech IT, 2027" }, { k:"Status", v:"Open to Work ✓", green:true }].map((r, i) => (
                    <div key={i} style={{ display: "flex", padding: "9px 14px", borderBottom: i < 3 ? "1px solid #f5f1eb" : "none", background: i % 2 === 0 ? "var(--ct-card)" : "#faf8f4", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", width: 64, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.k}</span>
                      <span style={{ fontSize: 12, color: r.green ? "var(--green)" : "var(--ct-sub)", fontWeight: r.green ? 500 : 400 }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--ct-card)", border: "1px solid var(--ct-line)", borderRadius: 10, padding: "14px" }}>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Certifications</p>
                  {CERTS.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < CERTS.length - 1 ? "1px solid #f5f1eb" : "none" }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                      <div>
                        <p style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ct-muted)", letterSpacing: "0.08em", marginBottom: 2 }}>{c.label}</p>
                        <p style={{ fontSize: 11, color: "var(--ct-sub)", lineHeight: 1.4 }}>{c.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {[{ icon:GH, url:"https://github.com/yashpatil1816" }, { icon:LI, url:"https://www.linkedin.com/in/yash-patil-39941a326/" }, { icon:EM, url:"mailto:yashpatil2571@gmail.com" }].map((c, i) => (
                    <a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                      style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--ct-line)", background: "var(--ct-card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ct-sub)", transition: "all 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--ct-line)"; e.currentTarget.style.color = "var(--ct-sub)"; e.currentTarget.style.transform = "none"; }}>
                      {c.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </ParallaxSection>

          {/* MARQUEE */}
          <div className="marquee-wrap">
            <div className="marquee-track">
              {MARQUEE.map((item, i) => <span key={i} className={i % 5 === 0 ? "acc" : ""}>{item} &nbsp;·&nbsp; </span>)}
            </div>
          </div>

          {/* ── ABOUT ── */}
          <ParallaxSection id="about" style={{ background: "#faf8f4" }}>
            <SH num="01" label="About" title={<>Backends Built<br />for Production</>} />
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
              <div>
                <p style={{ fontSize: 15, color: "var(--ct-sub)", lineHeight: 1.95, marginBottom: 16 }}>
                  I'm a <strong style={{ color: "var(--ct-text)" }}>Java Backend Developer</strong> pursuing B.Tech in Information Technology at G.H. Raisoni College of Engineering, Pune. My work sits at the intersection of distributed systems, event-driven architecture, and applied AI.
                </p>
                <p style={{ fontSize: 15, color: "var(--ct-sub)", lineHeight: 1.95, marginBottom: 28 }}>
                  Whether it's preventing race conditions with <strong style={{ color: "var(--ct-text)" }}>Redis distributed locking</strong>, routing transactions through a <strong style={{ color: "var(--ct-text)" }}>Kafka pipeline</strong>, or deploying a <strong style={{ color: "var(--ct-text)" }}>LangChain4j agentic loop</strong> for intelligent fraud detection — I design for scale and resilience.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {["OOP","REST","Microservices","JWT","Spring Security","DSA","JPA","Kafka","Redis","LangChain4j","Docker","CI/CD"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div>
                <div style={{ background: "var(--ct-card)", border: "1px solid var(--ct-line)", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {[{ label:"DEGREE", value:"B.Tech — IT" }, { label:"UNIVERSITY", value:"G.H. Raisoni, Pune" }, { label:"CGPA", value:"8.18 / 10" }, { label:"GRADUATING", value:"Expected 2027" }].map((r, i) => (
                      <div key={i} style={{ padding: "18px", borderRight: i % 2 === 0 ? "1px solid var(--ct-line)" : "none", borderBottom: i < 2 ? "1px solid var(--ct-line)" : "none", background: i % 2 === 0 ? "var(--ct-card)" : "#faf8f4" }}>
                        <p style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ct-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7 }}>{r.label}</p>
                        <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ct-text)", fontWeight: 700, lineHeight: 1.3 }}>{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Certifications</p>
                {CERTS.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "var(--ct-card)", border: "1px solid var(--ct-line)", borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ct-muted)", letterSpacing: "0.08em", marginBottom: 3 }}>{c.label}</p>
                      <p style={{ fontSize: 12, color: "var(--ct-sub)" }}>{c.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ParallaxSection>

          {/* ── SKILLS ── */}
          <ParallaxSection id="skills" style={{ background: "#f8f5f0" }}>
            <SH num="02" label="Skills" title="Tech Stack" />
            <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
              <div>
                <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Categories</p>
                {SKILL_CATS.map((cat, ci) => (
                  <div key={ci} style={{ marginBottom: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", width: 88, flexShrink: 0, paddingTop: 3 }}>{cat.label}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {cat.items.map(item => <span key={item} className="tag" style={{ fontSize: 11 }}>{item}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Proficiency</p>
                {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 80} />)}
              </div>
            </div>
          </ParallaxSection>

          {/* ── PROJECTS ── */}
          <ParallaxSection id="projects" style={{ background: "#ffffff" }}>
            <SH num="03" label="Projects" title="Selected Work" />
            {PROJECTS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <TiltCard onClick={() => setModal(p)} highlight={p.highlight}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ct-muted)" }}>{p.num} · {p.status}</span>
                    <span className="tag" style={{ fontSize: 9 }}>{p.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "var(--ct-text)", marginBottom: 10, lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--ct-sub)", lineHeight: 1.8, marginBottom: 16 }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {p.tech.map(t => <span key={t} className="tag" style={{ fontSize: 9 }}>{t}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {p.metrics.map((m, mi) => (
                        <span key={mi} style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 3, padding: "2px 7px" }}>{m}</span>
                      ))}
                      <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>Details →</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </ParallaxSection>

          {/* ── EXPERIENCE ── */}
          <ParallaxSection id="experience" style={{ background: "#faf8f4" }}>
            <SH num="04" label="Experience" title={<>Professional<br />Experience</>} />
            <motion.div className="exp-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--ct-text)", marginBottom: 4 }}>J.P. Morgan Chase & Co.</h3>
                  <p style={{ fontSize: 14, color: "var(--ct-sub)", fontWeight: 500 }}>Software Engineering Virtual Experience</p>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", marginTop: 3 }}>Forage (Virtual Program)</p>
                </div>
                <span className="tag" style={{ padding: "5px 10px", fontSize: 11 }}>Jan 2025</span>
              </div>
              <ul style={{ listStyle: "none", marginBottom: 18 }}>
                {["Developed backend services using Java and Spring Boot, handling REST APIs and improving response efficiency.",
                  "Integrated Apache Kafka for asynchronous communication, improving scalability and service decoupling.",
                  "Modeled relational entities using Spring Data JPA and persisted data in H2 database.",
                  "Applied layered architecture (Controller–Service–Repository) for clean and modular design.",
                ].map((b, bi) => (
                  <li key={bi} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--ct-sub)", lineHeight: 1.8, marginBottom: 6 }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>—</span>{b}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["Java","Spring Boot","Apache Kafka","JPA","H2"].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </motion.div>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(45,122,79,0.06)", border: "1px solid rgba(45,122,79,0.18)", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse 2.5s infinite", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--ct-sub)" }}>Currently available — open to Java Backend, SWE & Internship roles.</p>
            </div>
          </ParallaxSection>

          {/* ── CONTACT ── */}
          <ParallaxSection id="contact" style={{ background: "#f8f5f0" }}>
            <div style={{ marginBottom: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)" }}>05 —</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Contact</span>
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, color: "var(--ct-text)", lineHeight: 1.1, marginBottom: 10 }}>
                Let's build<br /><em style={{ color: "var(--gold)", fontWeight: 400 }}>something great.</em>
              </h2>
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ct-muted)", marginTop: 8 }}>Every message hits my inbox. I respond within a day.</p>
            </div>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48 }}>
              <div>
                {[
                  { label:"GITHUB", handle:"yashpatil1816", url:"https://github.com/yashpatil1816", icon:GH },
                  { label:"LINKEDIN", handle:"yash-patil-39941a326", url:"https://www.linkedin.com/in/yash-patil-39941a326/", icon:LI },
                  { label:"EMAIL", handle:"yashpatil2571@gmail.com", url:"mailto:yashpatil2571@gmail.com", icon:EM },
                  { label:"PHONE", handle:"+91 9022046356", url:"tel:+919022046356", icon:PH },
                ].map((c, i) => (
                  <motion.a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    className="contact-link"
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--ct-bg)", border: "1px solid var(--ct-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ct-sub)", flexShrink: 0 }}>{c.icon}</div>
                      <div>
                        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{c.label}</p>
                        <p style={{ fontSize: 12, color: "var(--ct-text)", fontWeight: 500 }}>{c.handle}</p>
                      </div>
                    </div>
                    <span style={{ color: "var(--ct-muted)", flexShrink: 0 }}>{ARR}</span>
                  </motion.a>
                ))}
              </div>
              <div style={{ background: "var(--ct-card)", border: "1px solid var(--ct-line)", borderRadius: 10, padding: "28px 24px" }}>
                <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>Send a message</p>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "36px 0" }}>
                    <p style={{ fontSize: 32, marginBottom: 12 }}>✉️</p>
                    <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--ct-text)", marginBottom: 8 }}>Message sent!</p>
                    <p style={{ fontSize: 13, color: "var(--ct-sub)" }}>Thanks for reaching out. I'll get back to you soon.</p>
                    <button onClick={() => setSent(false)} className="btn-outline" style={{ marginTop: 20 }}>Send another</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      {["name","email"].map(field => (
                        <div key={field}>
                          <label style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{field}</label>
                          <input type={field === "email" ? "email" : "text"} placeholder={field === "name" ? "Your name" : "your@email.com"} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="field" />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Message</label>
                      <textarea placeholder="What's on your mind?" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="field" style={{ resize: "vertical" }} />
                    </div>
                    {formErr && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 10 }}>{formErr}</p>}
                    <button onClick={handleSubmit} className="btn-dark" style={{ width: "100%", justifyContent: "center" }}>Send Message →</button>
                  </>
                )}
              </div>
            </div>
          </ParallaxSection>

          {/* FOOTER */}
          <footer style={{ padding: "22px 60px", borderTop: "1px solid var(--ct-line)", background: "var(--ct-card)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--ct-muted)", fontStyle: "italic" }}>Yash Patil · © 2026</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ct-muted)", letterSpacing: "0.08em" }}>Java Backend Developer · Built with React</span>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ icon:GH, url:"https://github.com/yashpatil1816" }, { icon:LI, url:"https://www.linkedin.com/in/yash-patil-39941a326/" }, { icon:EM, url:"mailto:yashpatil2571@gmail.com" }].map((c, i) => (
                <a key={i} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  style={{ color: "var(--ct-muted)", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--ct-muted)"}>
                  {c.icon}
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.93, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }} onClick={e => e.stopPropagation()}
              style={{ background: "var(--ct-card)", border: "1px solid var(--ct-line)", borderRadius: 12, padding: "clamp(20px,4vw,36px)", maxWidth: 580, width: "100%", maxHeight: "85vh", overflowY: "auto", position: "relative" }}>
              <button onClick={() => setModal(null)} style={{ position: "absolute", top: 14, right: 14, background: "var(--ct-bg)", border: "1px solid var(--ct-line)", borderRadius: 6, width: 30, height: 30, cursor: "pointer", color: "var(--ct-sub)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✕</button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)" }}>{modal.num} · {modal.status}</span>
                <span className="tag">{modal.tag}</span>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, marginBottom: 16, color: "var(--ct-text)" }}>{modal.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ct-sub)", lineHeight: 1.9, marginBottom: 20 }}>{modal.detail}</p>
              <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ct-muted)", marginBottom: 10 }}>Architecture: {modal.arch}</p>
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