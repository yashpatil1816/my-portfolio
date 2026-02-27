import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
    :root {
      --green:#00ff88;--cyan:#00d4ff;--purple:#bf91ff;--amber:#ffb347;--red:#f43f5e;
      --bg:#060810;--surface:rgba(255,255,255,0.03);--surface2:rgba(255,255,255,0.055);
      --text:#e2e8f0;--muted:#64748b;--muted2:#475569;
      --font-mono:'JetBrains Mono',monospace;--font-display:'Syne',sans-serif;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:var(--bg);color:var(--text);font-family:var(--font-mono);overflow-x:hidden;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-track{background:var(--bg);}
    ::-webkit-scrollbar-thumb{background:rgba(0,255,136,0.3);border-radius:2px;}
    ::selection{background:rgba(0,255,136,0.2);}
    a{text-decoration:none;}

    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

    /* ── DESKTOP CURSOR ── */
    @media (pointer: fine) {
      body { cursor: none; }
      a { cursor: none; }
      button { cursor: none !important; }
    }

    /* ── NAV RESPONSIVE ── */
    .nav-links { display: flex; align-items: center; gap: 32px; }
    .nav-resume { display: flex; }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav-resume { display: none; }
      .nav-mobile-btn { display: flex !important; }
    }

    /* ── HERO GRID ── */
    .hero-grid { display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; }
    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr 340px; gap: 48px; }
    }
    @media (max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr; gap: 48px; }
      .hero-right { order: -1; }
    }

    /* ── ABOUT GRID ── */
    .about-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 72px; }
    @media (max-width: 900px) {
      .about-grid { grid-template-columns: 1fr; gap: 40px; }
    }

    /* ── SKILLS GRID ── */
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
    @media (max-width: 900px) {
      .skills-grid { grid-template-columns: 1fr; gap: 40px; }
    }

    /* ── TECH GRID ── */
    .tech-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
    @media (max-width: 480px) {
      .tech-grid { grid-template-columns: repeat(2,1fr); }
    }

    /* ── PROJECTS GRID ── */
    .projects-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
    @media (max-width: 768px) {
      .projects-grid { grid-template-columns: 1fr; }
    }

    /* ── JOURNEY GRID ── */
    .journey-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
    @media (max-width: 768px) {
      .journey-grid { grid-template-columns: 1fr; }
    }

    /* ── CONTACT GRID ── */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    @media (max-width: 900px) {
      .contact-grid { grid-template-columns: 1fr; gap: 32px; }
    }

    /* ── CONTACT CARDS ── */
    .contact-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-content: start; }
    @media (max-width: 480px) {
      .contact-cards { grid-template-columns: 1fr; }
    }

    /* ── STATS ROW ── */
    .stats-row { display: flex; gap: 44px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap; }
    @media (max-width: 480px) {
      .stats-row { gap: 24px; }
    }

    /* ── COUNTER GRID ── */
    .counter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* ── FOOTER ── */
    .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    @media (max-width: 600px) {
      .footer-inner { flex-direction: column; text-align: center; }
    }

    /* ── SECTION PADDING ── */
    .section { padding: 100px 0; }
    @media (max-width: 768px) {
      .section { padding: 64px 0; }
    }

    /* ── WRAPPER ── */
    .wrap { max-width: 1200px; margin: 0 auto; padding: 0 52px; }
    @media (max-width: 768px) {
      .wrap { padding: 0 24px; }
    }
    @media (max-width: 480px) {
      .wrap { padding: 0 16px; }
    }

    /* ── HERO HEADING ── */
    .hero-h1 { font-family: var(--font-display); font-size: clamp(44px,8vw,80px); font-weight: 800; line-height: 1.0; letter-spacing: -3px; margin-bottom: 12px; }
    .hero-typewriter { font-size: clamp(13px,2vw,16px); color: var(--cyan); font-family: var(--font-mono); margin-bottom: 20px; min-height: 26px; }
    .hero-desc { font-size: clamp(13px,1.5vw,14px); color: var(--muted); line-height: 1.85; max-width: 520px; margin-bottom: 36px; }

    /* ── MOBILE MENU ── */
    .mobile-menu { display: none; position: fixed; top: 62px; left: 0; right: 0; background: rgba(6,8,16,0.98); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,255,136,0.1); z-index: 99; padding: 20px 24px; flex-direction: column; gap: 20px; }
    .mobile-menu.open { display: flex; }
    @media (max-width: 768px) {
      .nav-mobile-btn { display: flex !important; }
    }

    /* ── PROFILE PHOTO SIZE ── */
    .profile-photo-wrap { width: 210px; height: 210px; }
    @media (max-width: 768px) {
      .profile-photo-wrap { width: 170px; height: 170px; }
    }
    @media (max-width: 480px) {
      .profile-photo-wrap { width: 150px; height: 150px; }
    }

    /* ── NAV HEIGHT ── */
    .nav-inner { height: 62px; }
    @media (max-width: 768px) {
      .nav-inner { height: 56px; }
    }
  `}</style>
);

const Cursor = () => {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let rx=0,ry=0,dx=0,dy=0;
    const onMove=(e)=>{ dx=e.clientX; dy=e.clientY; if(dot.current){dot.current.style.left=`${dx}px`;dot.current.style.top=`${dy}px`;} };
    const raf=()=>{ rx+=(dx-rx)*0.12; ry+=(dy-ry)*0.12; if(ring.current){ring.current.style.left=`${rx}px`;ring.current.style.top=`${ry}px`;} requestAnimationFrame(raf); };
    window.addEventListener("mousemove",onMove); requestAnimationFrame(raf);
    return ()=>window.removeEventListener("mousemove",onMove);
  },[]);
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;
  return (<>
    <div ref={dot} style={{position:"fixed",width:6,height:6,background:"var(--green)",borderRadius:"50%",pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)"}}/>
    <div ref={ring} style={{position:"fixed",width:30,height:30,border:"1.5px solid rgba(0,255,136,0.5)",borderRadius:"50%",pointerEvents:"none",zIndex:9998,transform:"translate(-50%,-50%)"}}/>
  </>);
};

const Typewriter = ({ words, speed=75, pause=2000 }) => {
  const [idx,setIdx]=useState(0),[sub,setSub]=useState(0),[del,setDel]=useState(false);
  useEffect(()=>{
    const word=words[idx];
    const t=del?setTimeout(()=>{setSub(s=>s-1);if(sub<=1){setDel(false);setIdx(i=>(i+1)%words.length);}},35):sub<word.length?setTimeout(()=>setSub(s=>s+1),speed):setTimeout(()=>setDel(true),pause);
    return ()=>clearTimeout(t);
  },[idx,sub,del,words,speed,pause]);
  return <>{words[idx].slice(0,sub)}<span style={{color:"var(--green)",animation:"blink 1s step-end infinite"}}>|</span></>;
};

const Terminal = () => {
  const lines=[
    {prompt:"$",cmd:" cat about.txt",delay:0},
    {out:"> Java Backend Developer",delay:400},
    {out:"> Spring Boot · Microservices",delay:700},
    {prompt:"$",cmd:" ls skills/",delay:1100},
    {out:"JWT  Kafka  JPA  Spring-Security",delay:1500},
    {prompt:"$",cmd:" echo $STATUS",delay:1900},
    {out:"> Open to opportunities ✓",delay:2300,green:true},
  ];
  const [vis,setVis]=useState(0);
  useEffect(()=>{lines.forEach((l,i)=>setTimeout(()=>setVis(i+1),l.delay+600));},[]);
  return (
    <div style={{background:"rgba(6,8,16,0.97)",border:"1px solid rgba(0,255,136,0.12)",borderRadius:12,overflow:"hidden",fontSize:12}}>
      <div style={{background:"rgba(255,255,255,0.04)",padding:"9px 14px",display:"flex",alignItems:"center",gap:7,borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        {[{c:"#ff5f57"},{c:"#febc2e"},{c:"#28c840"}].map((d,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:d.c}}/>)}
        <span style={{color:"var(--muted)",fontSize:10,marginLeft:6,fontFamily:"var(--font-mono)"}}>terminal — yash@portfolio</span>
      </div>
      <div style={{padding:"14px 18px",minHeight:140}}>
        {lines.slice(0,vis).map((l,i)=>(
          <div key={i} style={{marginBottom:3,lineHeight:1.8,fontFamily:"var(--font-mono)",fontSize:11}}>
            {l.prompt&&<><span style={{color:"var(--green)"}}>yash@dev:~</span><span style={{color:"var(--muted)"}}>{l.prompt}</span><span style={{color:"var(--text)"}}>{l.cmd}</span></>}
            {l.out&&<span style={{color:l.green?"var(--green)":"var(--muted)",paddingLeft:6}}>{l.out}</span>}
          </div>
        ))}
        {vis>=lines.length&&<div style={{color:"var(--green)",fontFamily:"var(--font-mono)",fontSize:11,display:"flex",gap:4}}>yash@dev:~$<span style={{animation:"blink 1s step-end infinite"}}>▋</span></div>}
      </div>
    </div>
  );
};

const SkillBar = ({ name, level, color, delay }) => {
  const [w,setW]=useState(0); const ref=useRef();
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setTimeout(()=>setW(level),delay)},{threshold:0.3});
    if(ref.current)o.observe(ref.current); return ()=>o.disconnect();
  },[level,delay]);
  return (
    <div ref={ref} style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
        <span style={{color:"var(--text)",fontFamily:"var(--font-mono)"}}>{name}</span>
        <span style={{color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{level}%</span>
      </div>
      <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,background:`linear-gradient(90deg,${color},${color}99)`,borderRadius:2,transition:"width 1.3s cubic-bezier(0.22,1,0.36,1)",boxShadow:`0 0 6px ${color}50`}}/>
      </div>
    </div>
  );
};

const TechGrid = () => {
  const techs=[
    {l:"Java",c:"#f97316",icon:"☕"},{l:"Spring Boot",c:"#00ff88",icon:"🍃"},{l:"Apache Kafka",c:"#f43f5e",icon:"📨"},
    {l:"REST API",c:"#00d4ff",icon:"🔌"},{l:"JPA/Hibernate",c:"#bf91ff",icon:"🗄️"},{l:"Spring Security",c:"#fbbf24",icon:"🔒"},
    {l:"JWT Auth",c:"#34d399",icon:"🔑"},{l:"MySQL",c:"#f97316",icon:"🛢️"},{l:"Spring Cloud",c:"#00ff88",icon:"☁️"},
    {l:"Microservices",c:"#00d4ff",icon:"🔧"},{l:"Git / Maven",c:"#f43f5e",icon:"📦"},{l:"Postman",c:"#ffb347",icon:"📬"},
  ];
  return (
    <div className="tech-grid">
      {techs.map((t,i)=>(
        <motion.div key={i} initial={{opacity:0,scale:0.85}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.04,duration:0.3}}
          style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${t.c}20`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:9,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`${t.c}0d`;e.currentTarget.style.borderColor=`${t.c}50`;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 20px ${t.c}15`;}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.025)";e.currentTarget.style.borderColor=`${t.c}20`;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
          <span style={{fontSize:18}}>{t.icon}</span>
          <span style={{fontSize:11,fontWeight:600,color:t.c,fontFamily:"var(--font-mono)"}}>{t.l}</span>
        </motion.div>
      ))}
    </div>
  );
};

const ProjectCard = ({ project, onClick }) => {
  const [hov,setHov]=useState(false);
  return (
    <motion.div onClick={()=>onClick(project)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.4}}
      style={{background:hov?"var(--surface2)":"var(--surface)",border:`1px solid ${hov?project.accent+"40":"rgba(0,255,136,0.07)"}`,borderRadius:12,padding:"24px",cursor:"pointer",position:"relative",overflow:"hidden",transition:"all 0.22s",boxShadow:hov?`0 20px 50px rgba(0,0,0,0.5),0 0 20px ${project.accent}10`:"none",transform:hov?"translateY(-5px)":"none"}}>
      <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:project.accent,opacity:hov?1:0.35,transition:"opacity 0.22s"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <span style={{fontSize:26}}>{project.emoji}</span>
        <span style={{fontSize:9,padding:"3px 9px",border:`1px solid ${project.accent}40`,borderRadius:20,color:project.accent,fontFamily:"var(--font-mono)",letterSpacing:1}}>{project.tag}</span>
      </div>
      <div style={{fontFamily:"var(--font-display)",fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:8}}>{project.title}</div>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {project.metrics.map(m=><span key={m} style={{fontSize:10,padding:"2px 8px",background:`${project.accent}10`,border:`1px solid ${project.accent}28`,borderRadius:20,color:project.accent}}>{m}</span>)}
      </div>
      <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.75,marginBottom:14}}>{project.description}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
        {project.tech.map(t=><span key={t} style={{fontSize:10,padding:"2px 7px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:4,color:"var(--muted)"}}>{t}</span>)}
      </div>
      <div style={{fontSize:10,color:project.accent,opacity:hov?1:0.45,transition:"opacity 0.2s",letterSpacing:1}}>VIEW DETAILS →</div>
    </motion.div>
  );
};

const Counter = ({ to, suffix, label, color }) => {
  const [n,setN]=useState(0); const ref=useRef(); const [vis,setVis]=useState(false);
  useEffect(()=>{ const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.5}); if(ref.current)o.observe(ref.current); return ()=>o.disconnect(); },[]);
  useEffect(()=>{ if(!vis)return; let s=0,step=to/55; const t=setInterval(()=>{s+=step;if(s>=to){setN(to);clearInterval(t);}else setN(s);},16); return ()=>clearInterval(t); },[vis,to]);
  return (
    <div ref={ref} style={{textAlign:"center"}}>
      <div style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,3vw,30px)",fontWeight:800,color:color||"var(--green)"}}>{Number.isInteger(to)?Math.round(n):parseFloat(n).toFixed(2)}{suffix}</div>
      <div style={{fontSize:9,color:"var(--muted)",letterSpacing:2,marginTop:3}}>{label}</div>
    </div>
  );
};

const WeatherWidget = () => {
  const [input,setInput]=useState(""),[data,setData]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
  const fetchWeather=useCallback(async(q)=>{
    if(!q.trim())return; setLoading(true); setError(""); setData(null);
    try{ const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`); if(!res.ok)throw new Error("City not found"); setData(await res.json()); }
    catch(e){setError(e.message);}finally{setLoading(false);}
  },[]);
  useEffect(()=>{fetchWeather("Pune");},[]);
  const icon=(m="")=>{m=m.toLowerCase();if(m.includes("clear"))return"☀️";if(m.includes("cloud"))return"⛅";if(m.includes("rain"))return"🌧️";if(m.includes("thunder"))return"⛈️";if(m.includes("snow"))return"❄️";if(m.includes("mist")||m.includes("fog"))return"🌫️";return"🌡️";};
  return (
    <div style={{background:"rgba(0,212,255,0.04)",border:"1px solid rgba(0,212,255,0.15)",borderRadius:10,padding:16}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchWeather(input)} placeholder="Search city..." style={{flex:1,padding:"6px 10px",background:"rgba(0,212,255,0.05)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:6,color:"var(--text)",fontFamily:"var(--font-mono)",fontSize:11,outline:"none"}}/>
        <button onClick={()=>fetchWeather(input)} style={{background:"var(--cyan)",border:"none",borderRadius:6,padding:"6px 12px",color:"#06080f",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700}}>RUN</button>
      </div>
      {loading&&<div style={{color:"var(--muted)",fontSize:11}}>// fetching...</div>}
      {error&&<div style={{color:"var(--red)",fontSize:11}}>// Error: {error}</div>}
      {data&&!loading&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:24}}>{icon(data.weather[0]?.main)}</span>
            <div>
              <div style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700}}>{data.name}, {data.sys.country}</div>
              <div style={{fontSize:22,fontWeight:800,color:"var(--cyan)"}}>{Math.round(data.main.temp)}°C</div>
              <div style={{fontSize:10,color:"var(--muted)",textTransform:"capitalize"}}>{data.weather[0]?.description}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {[{l:"Feels",v:`${Math.round(data.main.feels_like)}°`,i:"🌡️"},{l:"Humidity",v:`${data.main.humidity}%`,i:"💧"},{l:"Wind",v:`${Math.round(data.wind.speed*3.6)}km/h`,i:"💨"},{l:"Visibility",v:`${((data.visibility||10000)/1000).toFixed(1)}km`,i:"👁️"}].map(s=>(
              <div key={s.l} style={{background:"rgba(0,212,255,0.05)",borderRadius:7,padding:"7px",textAlign:"center"}}>
                <div style={{fontSize:13}}>{s.i}</div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--cyan)"}}>{s.v}</div>
                <div style={{fontSize:9,color:"var(--muted)"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ num, title }) => (
  <div style={{marginBottom:52}}>
    <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",marginBottom:10,letterSpacing:3}}>// {num}</div>
    <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(26px,4vw,46px)",fontWeight:800,color:"var(--text)",letterSpacing:-1.5,lineHeight:1.1}}>{title}</h2>
    <div style={{width:44,height:2,background:"linear-gradient(90deg,var(--green),transparent)",borderRadius:1,marginTop:14}}/>
  </div>
);

/* DATA */
const PROJECTS=[
  {title:"CineReserve",description:"Production-grade movie ticket booking backend with JWT auth, real-time seat availability, role-based access control across 10+ entities using layered REST architecture.",tech:["Java","Spring Boot","MySQL","JPA/Hibernate","JWT","Spring Security"],tag:"REST API",emoji:"🎬",accent:"#00d4ff",metrics:["10+ entities","JWT + RBAC"],arch:"Controller–Service–Repository",detail:"Designed and built a modular RESTful backend for movie ticket booking. Enforced stateless JWT authentication and role-based authorization (Admin/User). Built APIs for movie management, show scheduling, seat selection, booking workflows, and real-time seat validation. Normalized relational DB schema to support concurrent transactions with minimal redundancy.",github:"https://github.com/yashpatil1816"},
  {title:"ShopSphere",description:"5-service microservices e-commerce platform with API Gateway, load balancing, JWT RBAC, and event-driven cross-service messaging for data consistency.",tech:["Java","Spring Boot","Spring Cloud","JWT","API Gateway","Kafka"],tag:"MICROSERVICES",emoji:"🛒",accent:"#00ff88",metrics:["5 services","Event-driven"],arch:"Microservices + Gateway",detail:"Engineered a production microservices platform: user, product, order, payment, notification services — each with its own isolated database. Configured API Gateway for intelligent routing and load balancing. JWT-based stateless authentication with Admin/User RBAC. Event-driven cross-service messaging for eventual consistency.",github:"https://github.com/yashpatil1816"},
  {title:"WeatherSphere",description:"Real-time weather data proxy service integrating OpenWeatherMap REST API — demonstrates production API integration patterns: routing, transformation, error handling.",tech:["Java","Spring Boot","REST API","OpenWeatherMap","HTTP Client"],tag:"API INTEGRATION",emoji:"🌦️",accent:"#bf91ff",metrics:["Live API","Multi-metric"],arch:"API Proxy + Transform",detail:"Spring Boot service acting as a proxy to OpenWeatherMap REST API. Handles request routing, response transformation, error management, and JSON deserialization — demonstrating real-world third-party API integration patterns used in production backends.",isWeather:true,github:"https://github.com/yashpatil1816"},
  {title:"J.P. Morgan Virtual Experience",description:"Software engineering simulation: Apache Kafka for async messaging between 2 services, 4+ REST endpoints, 3+ JPA entities with H2 in-memory DB.",tech:["Java","Spring Boot","Apache Kafka","Spring Data JPA","H2"],tag:"VIRTUAL EXP.",emoji:"🏦",accent:"#ffb347",metrics:["4+ endpoints","Kafka async"],arch:"Event-Driven Services",detail:"Completed J.P. Morgan Chase & Co. Software Engineering Virtual Experience on Forage. Back-end development with Java + Spring Boot. Apache Kafka for async message processing between 2 services. REST controller implementation. Spring Data JPA entity modeling with H2 in-memory database.",github:"https://github.com/yashpatil1816"},
];

const TIMELINE=[
  {year:"2023",title:"B.Tech Begins",desc:"Enrolled at G.H. Raisoni College of Engineering, Pune. Deep-dived into OOP, data structures, and Java.",color:"var(--green)"},
  {year:"2024",title:"Spring Boot Mastery",desc:"Solid foundation in Spring Boot, Spring Security, JPA/Hibernate. Solved 100+ DSA problems on LeetCode.",color:"var(--cyan)"},
  {year:"Jan 2025",title:"J.P. Morgan Simulation",desc:"Completed J.P. Morgan Chase Software Engineering Virtual Experience — Kafka, REST APIs, JPA.",color:"var(--amber)"},
  {year:"Oct 2025",title:"Oracle AI Certified",desc:"Earned Oracle Cloud Infrastructure 2025 AI Foundations Associate certification — ID: 3232586990.",color:"var(--purple)"},
  {year:"Jan 2026",title:"CineReserve Launched",desc:"Production-grade movie booking backend: JWT auth, RBAC, normalized DB schema, full RESTful API.",color:"var(--green)"},
  {year:"2026–27",title:"ShopSphere + Graduation",desc:"Building 5-service microservices platform. B.Tech completion CGPA 8.18/10 — targeting Java Backend roles.",color:"var(--cyan)"},
];

const SKILLS=[
  {name:"Java",level:90,color:"#f97316"},{name:"Spring Boot / Spring Security",level:87,color:"#00ff88"},
  {name:"REST APIs & Architecture",level:85,color:"#00d4ff"},{name:"Spring Data JPA / Hibernate",level:83,color:"#bf91ff"},
  {name:"SQL & Database Design",level:80,color:"#fbbf24"},{name:"Microservices & Spring Cloud",level:76,color:"#34d399"},
  {name:"Apache Kafka",level:72,color:"#f43f5e"},{name:"DSA & Problem Solving",level:78,color:"#ffb347"},
];

const GH=<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const LI=<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const EM=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>;
const PH=<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.34 6.34l1.47-1.47a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;

const CONTACT_LINKS=[
  {label:"GitHub",handle:"yashpatil1816",url:"https://github.com/yashpatil1816",accent:"#00ff88",icon:GH},
  {label:"LinkedIn",handle:"yash-patil-39941a326",url:"https://www.linkedin.com/in/yash-patil-39941a326/",accent:"#00d4ff",icon:LI},
  {label:"Email",handle:"yashpatil2571@gmail.com",url:"mailto:yashpatil2571@gmail.com",accent:"#bf91ff",icon:EM},
  {label:"Phone",handle:"+91 9022046356",url:"tel:+919022046356",accent:"#ffb347",icon:PH},
];

export default function App() {
  const [modal,setModal]=useState(null);
  const [mobileMenu,setMobileMenu]=useState(false);
  const {scrollYProgress}=useScroll();
  const scrollTo=(id)=>{ document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMobileMenu(false); };

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh"}}>
      <GlobalStyle/><Cursor/>
      <motion.div style={{position:"fixed",top:0,left:0,height:2,background:"linear-gradient(90deg,var(--green),var(--cyan))",transformOrigin:"left",scaleX:scrollYProgress,zIndex:1000}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,backdropFilter:"blur(24px)",background:"rgba(6,8,16,0.92)",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div className="wrap nav-inner" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",overflow:"hidden",border:"2px solid var(--green)",flexShrink:0}}>
              <img src="/profile.jpg" alt="YP" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 10%"}}/>
            </div>
            <span style={{fontFamily:"var(--font-mono)",fontSize:13,color:"var(--green)",fontWeight:600}}>~/yash-patil</span>
          </div>

          {/* Desktop links */}
          <div className="nav-links">
            {["About","Skills","Projects","Journey","Contact"].map(l=>(
              <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:1,color:"var(--muted)",padding:0,transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="var(--green)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</button>
            ))}
            <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",border:"1px solid rgba(0,255,136,0.3)",borderRadius:6,background:"rgba(0,255,136,0.05)",color:"var(--green)",fontFamily:"var(--font-mono)",fontSize:11,transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,255,136,0.12)";e.currentTarget.style.boxShadow="0 0 16px rgba(0,255,136,0.18)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,255,136,0.05)";e.currentTarget.style.boxShadow="none"}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              resume.pdf
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className="nav-mobile-btn" onClick={()=>setMobileMenu(!mobileMenu)}
            style={{display:"none",background:"none",border:"1px solid rgba(0,255,136,0.3)",borderRadius:6,padding:"6px 10px",color:"var(--green)",cursor:"pointer",flexDirection:"column",gap:4,alignItems:"center",justifyContent:"center"}}>
            <div style={{width:18,height:2,background:"var(--green)",borderRadius:1,transition:"all 0.2s",transform:mobileMenu?"rotate(45deg) translate(4px,4px)":"none"}}/>
            <div style={{width:18,height:2,background:"var(--green)",borderRadius:1,transition:"all 0.2s",opacity:mobileMenu?0:1}}/>
            <div style={{width:18,height:2,background:"var(--green)",borderRadius:1,transition:"all 0.2s",transform:mobileMenu?"rotate(-45deg) translate(4px,-4px)":"none"}}/>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${mobileMenu?" open":""}`}>
          {["About","Skills","Projects","Journey","Contact"].map(l=>(
            <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:14,color:"var(--muted)",padding:"4px 0",textAlign:"left",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="var(--green)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>{l}</button>
          ))}
          <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",border:"1px solid rgba(0,255,136,0.3)",borderRadius:6,background:"rgba(0,255,136,0.05)",color:"var(--green)",fontFamily:"var(--font-mono)",fontSize:12,width:"fit-content"}}>
            ↓ Download Resume
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",paddingTop:62}}>
        <div style={{position:"absolute",top:"30%",left:"3%",width:"40vw",height:"40vw",background:"radial-gradient(circle,rgba(0,255,136,0.05) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"15%",right:"3%",width:"30vw",height:"30vw",background:"radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(0,255,136,0.06) 1px,transparent 1px)",backgroundSize:"44px 44px",pointerEvents:"none",opacity:0.3}}/>

        <div className="wrap hero-grid" style={{width:"100%",position:"relative",zIndex:1}}>
          {/* LEFT */}
          <div>
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",border:"1px solid rgba(0,255,136,0.2)",borderRadius:20,marginBottom:24,background:"rgba(0,255,136,0.04)"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"inline-block",animation:"pulse 2s infinite"}}/>
                <span style={{fontSize:11,color:"var(--green)",fontFamily:"var(--font-mono)",letterSpacing:1}}>Available for opportunities</span>
              </div>
            </motion.div>

            <motion.h1 className="hero-h1" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1}}>
              Yash<br/><span style={{color:"var(--green)",textShadow:"0 0 40px rgba(0,255,136,0.28)"}}>Patil</span>
            </motion.h1>

            <motion.div className="hero-typewriter" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
              &gt;&nbsp;<Typewriter words={["Java Backend Developer","Spring Boot Engineer","Microservices Architect","REST API Specialist"]}/>
            </motion.div>

            <motion.p className="hero-desc" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
              Building scalable RESTful APIs and microservices with Spring Boot. Passionate about clean architecture and backend systems that scale.
              <br/><span style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:6,display:"block"}}>CGPA 8.18/10 · B.Tech IT, G.H. Raisoni College, Pune</span>
            </motion.p>

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} style={{display:"flex",gap:12,marginBottom:40,flexWrap:"wrap"}}>
              <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer"
                style={{display:"flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:8,background:"var(--green)",color:"#060810",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,transition:"all 0.2s",boxShadow:"0 0 28px rgba(0,255,136,0.22)"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 42px rgba(0,255,136,0.42)";e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 0 28px rgba(0,255,136,0.22)";e.currentTarget.style.transform="none"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
              </a>
              <button onClick={()=>scrollTo("contact")}
                style={{padding:"12px 22px",borderRadius:8,border:"1px solid rgba(0,255,136,0.2)",background:"transparent",color:"var(--muted)",fontFamily:"var(--font-mono)",fontSize:12,cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.5)";e.currentTarget.style.color="var(--green)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.2)";e.currentTarget.style.color="var(--muted)"}}>Let's Talk →</button>
            </motion.div>

            <motion.div className="stats-row" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.65}}>
              {[{n:"4+",l:"Projects",c:"var(--green)"},{n:"5",l:"Microservices",c:"var(--cyan)"},{n:"100+",l:"DSA Solved",c:"var(--purple)"},{n:"8.18",l:"CGPA / 10",c:"var(--amber)"}].map(s=>(
                <div key={s.l}>
                  <div style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,3vw,28px)",fontWeight:800,color:s.c}}>{s.n}</div>
                  <div style={{fontSize:10,color:"var(--muted)",letterSpacing:1,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div className="hero-right" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2}}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            {/* Spinning ring + circular photo */}
            <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"absolute",inset:-5,borderRadius:"50%",background:"conic-gradient(from 0deg,var(--green),var(--cyan),var(--purple),var(--amber),var(--green))",animation:"spin 5s linear infinite",zIndex:0}}/>
              <div style={{position:"absolute",inset:-1,borderRadius:"50%",background:"var(--bg)",zIndex:1}}/>
              <div className="profile-photo-wrap" style={{position:"relative",zIndex:2,borderRadius:"50%",overflow:"hidden"}}>
                <img src="/profile.jpg" alt="Yash Patil" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 8%",display:"block",filter:"brightness(0.95) contrast(1.05)"}}/>
              </div>
              <div style={{position:"absolute",bottom:12,right:12,zIndex:3,width:18,height:18,borderRadius:"50%",background:"var(--green)",border:"3px solid var(--bg)",boxShadow:"0 0 12px rgba(0,255,136,0.9)"}}/>
            </div>

            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-display)",fontSize:"clamp(16px,2vw,20px)",fontWeight:800,color:"var(--text)"}}>Yash Patil</div>
              <div style={{fontSize:11,color:"var(--green)",fontFamily:"var(--font-mono)",marginTop:4,marginBottom:12}}>Java Backend Developer · Pune</div>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                {CONTACT_LINKS.slice(0,3).map(c=>(
                  <a key={c.label} href={c.url} target={c.url.startsWith("http")?"_blank":undefined} rel="noreferrer"
                    style={{width:34,height:34,borderRadius:"50%",border:`1px solid ${c.accent}30`,background:`${c.accent}08`,display:"flex",alignItems:"center",justifyContent:"center",color:c.accent,transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${c.accent}22`;e.currentTarget.style.borderColor=c.accent;e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${c.accent}08`;e.currentTarget.style.borderColor=`${c.accent}30`;e.currentTarget.style.transform="none"}}>
                    <div style={{width:16,height:16}}>{c.icon}</div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{width:"100%"}}><Terminal/></div>

            <div style={{width:"100%",padding:"11px 14px",border:"1px solid rgba(191,145,255,0.22)",borderRadius:9,background:"rgba(191,145,255,0.04)",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🏅</span>
              <div>
                <div style={{fontSize:9,color:"var(--purple)",letterSpacing:2,marginBottom:1}}>CERTIFIED</div>
                <div style={{fontSize:11,color:"var(--text)",lineHeight:1.5}}>Oracle Cloud Infrastructure 2025 AI Foundations</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"var(--muted2)",letterSpacing:3}}>SCROLL</span>
          <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.6}} style={{width:1,height:36,background:"linear-gradient(to bottom,var(--green),transparent)"}}/>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="wrap">
          <SectionHeader num="01 — about" title="Backends Built for Production"/>
          <div className="about-grid">
            <div>
              <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.95,marginBottom:16}}>Java Backend Developer with hands-on experience building scalable microservices and RESTful APIs with Spring Boot. Proficient in JWT-based auth, third-party API integration, and layered architecture design.</p>
              <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.95,marginBottom:28}}>Strong foundation in relational database modeling, OOP principles, system design, and DSA. Currently pursuing B.Tech in Information Technology at G.H. Raisoni College of Engineering, Pune — CGPA 8.18/10, Expected 2027.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {["OOP","REST","Microservices","JWT","Spring Security","DSA","JPA","Kafka","MySQL","Git"].map(t=>(
                  <span key={t} style={{fontSize:11,padding:"5px 13px",border:"1px solid rgba(0,255,136,0.18)",borderRadius:20,color:"var(--green)",background:"rgba(0,255,136,0.04)",fontFamily:"var(--font-mono)"}}>{t}</span>
                ))}
              </div>
            </div>
            <div className="counter-grid">
              {[{to:4,s:"+",l:"PROJECTS SHIPPED",c:"var(--green)"},{to:5,s:"",l:"MICROSERVICES",c:"var(--cyan)"},{to:100,s:"+",l:"DSA PROBLEMS",c:"var(--purple)"},{to:8.18,s:"/10",l:"CGPA",c:"var(--amber)"}].map((s,i)=>(
                <div key={i} style={{padding:"24px 16px",border:"1px solid rgba(0,255,136,0.07)",borderRadius:12,background:"var(--surface)",textAlign:"center",transition:"border-color 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=`${s.c}30`}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,255,136,0.07)"}>
                  <Counter to={s.to} suffix={s.s} label={s.l} color={s.c}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section" style={{background:"rgba(255,255,255,0.012)"}}>
        <div className="wrap">
          <SectionHeader num="02 — skills" title="Tech Stack"/>
          <div className="skills-grid">
            <div>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:18,fontFamily:"var(--font-mono)",letterSpacing:1}}>// technologies</div>
              <TechGrid/>
            </div>
            <div>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:18,fontFamily:"var(--font-mono)",letterSpacing:1}}>// proficiency</div>
              {SKILLS.map((s,i)=><SkillBar key={s.name} {...s} delay={i*90}/>)}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="wrap">
          <SectionHeader num="03 — projects" title="What I've Shipped"/>
          <div className="projects-grid">
            {PROJECTS.map(p=><ProjectCard key={p.title} project={p} onClick={setModal}/>)}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="section" style={{background:"rgba(255,255,255,0.012)"}}>
        <div className="wrap">
          <SectionHeader num="04 — journey" title="The Road So Far"/>
          <div className="journey-grid">
            {TIMELINE.map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                style={{padding:"20px 22px",border:"1px solid rgba(0,255,136,0.07)",borderRadius:12,background:"var(--surface)",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${item.color}35`;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.3)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.07)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:item.color}}/>
                <div style={{fontSize:10,color:item.color,fontFamily:"var(--font-mono)",letterSpacing:2,marginBottom:8}}>{item.year}</div>
                <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:15,marginBottom:8,color:"var(--text)"}}>{item.title}</div>
                <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.75}}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="wrap">
          <SectionHeader num="05 — contact" title="Let's Connect"/>
          <p style={{fontSize:12,color:"var(--muted)",marginBottom:40,fontFamily:"var(--font-mono)"}}>{`// Open to Java Backend, SWE & Internship opportunities`}</p>
          <div className="contact-grid">
            <div className="contact-cards">
              {CONTACT_LINKS.map((c,i)=>(
                <motion.a key={i} href={c.url} target={c.url.startsWith("http")?"_blank":undefined} rel="noreferrer"
                  initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.09}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"16px",border:`1px solid ${c.accent}18`,borderRadius:10,background:"var(--surface)",transition:"all 0.2s",textDecoration:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${c.accent}45`;e.currentTarget.style.boxShadow=`0 8px 28px rgba(0,0,0,0.3)`;e.currentTarget.style.transform="translateY(-3px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=`${c.accent}18`;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
                  <div style={{width:38,height:38,borderRadius:9,background:`${c.accent}10`,border:`1px solid ${c.accent}22`,display:"flex",alignItems:"center",justifyContent:"center",color:c.accent,flexShrink:0}}>{c.icon}</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:10,color:"var(--muted)",letterSpacing:1,marginBottom:3}}>{c.label}</div>
                    <div style={{fontSize:11,color:"var(--text)",fontFamily:"var(--font-mono)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.handle}</div>
                  </div>
                </motion.a>
              ))}
            </div>
            <div style={{background:"var(--surface)",border:"1px solid rgba(0,255,136,0.07)",borderRadius:14,padding:"clamp(16px,3vw,28px)"}}>
              <div style={{fontSize:11,color:"var(--green)",fontFamily:"var(--font-mono)",marginBottom:20,letterSpacing:1}}>// send_message()</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                {["Name","Email"].map(l=>(
                  <div key={l}>
                    <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:5,letterSpacing:1}}>{l.toUpperCase()}</label>
                    <input placeholder={`Your ${l}`} style={{width:"100%",padding:"10px 12px",background:"rgba(0,255,136,0.02)",border:"1px solid rgba(0,255,136,0.09)",borderRadius:6,color:"var(--text)",fontSize:12,fontFamily:"var(--font-mono)",outline:"none",transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor="rgba(0,255,136,0.35)"} onBlur={e=>e.target.style.borderColor="rgba(0,255,136,0.09)"}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:5,letterSpacing:1}}>MESSAGE</label>
                <textarea placeholder="Your message..." rows={4} style={{width:"100%",padding:"10px 12px",background:"rgba(0,255,136,0.02)",border:"1px solid rgba(0,255,136,0.09)",borderRadius:6,color:"var(--text)",fontSize:12,fontFamily:"var(--font-mono)",outline:"none",resize:"vertical",transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor="rgba(0,255,136,0.35)"} onBlur={e=>e.target.style.borderColor="rgba(0,255,136,0.09)"}/>
              </div>
              <button style={{padding:"11px 28px",background:"var(--green)",border:"none",borderRadius:7,color:"#060810",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.2s",letterSpacing:1}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 24px rgba(0,255,136,0.35)";e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>SEND →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.04)",padding:"28px 0"}}>
        <div className="wrap footer-inner">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:26,height:26,borderRadius:"50%",overflow:"hidden",border:"1px solid rgba(0,255,136,0.3)"}}>
              <img src="/profile.jpg" alt="YP" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 10%"}}/>
            </div>
            <span style={{fontSize:12,color:"var(--muted2)",fontFamily:"var(--font-mono)"}}>yash-patil · © 2026</span>
          </div>
          <span style={{fontSize:11,color:"var(--muted2)"}}>Java Backend Developer · Built with React</span>
          <div style={{display:"flex",gap:14}}>
            {CONTACT_LINKS.slice(0,3).map(c=>(
              <a key={c.label} href={c.url} target={c.url.startsWith("http")?"_blank":undefined} rel="noreferrer"
                style={{color:"var(--muted2)",transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=c.accent} onMouseLeave={e=>e.currentTarget.style.color="var(--muted2)"}>{c.icon}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {modal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setModal(null)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(10px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
            <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0}} onClick={e=>e.stopPropagation()}
              style={{background:"#0a0d14",border:`1px solid ${modal.accent}28`,borderRadius:16,padding:"clamp(20px,4vw,36px)",maxWidth:620,width:"100%",maxHeight:"85vh",overflowY:"auto",position:"relative"}}>
              <button onClick={()=>setModal(null)} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:6,width:30,height:30,cursor:"pointer",color:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✕</button>
              <div style={{fontSize:34,marginBottom:12}}>{modal.emoji}</div>
              <span style={{fontSize:10,padding:"3px 10px",border:`1px solid ${modal.accent}40`,borderRadius:20,color:modal.accent,display:"inline-block",marginBottom:14}}>{modal.tag}</span>
              <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(18px,3vw,26px)",fontWeight:800,marginBottom:16,display:"block"}}>{modal.title}</h3>
              <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.85,marginBottom:20}}>{modal.detail}</p>
              {modal.isWeather&&(<div style={{marginBottom:20}}><div style={{fontSize:10,color:"var(--cyan)",fontFamily:"var(--font-mono)",marginBottom:8}}>// LIVE_DEMO: real API data</div><WeatherWidget/></div>)}
              <div style={{fontSize:11,color:"var(--muted2)",fontFamily:"var(--font-mono)",marginBottom:14}}>// arch: {modal.arch}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
                {modal.tech.map((t,i)=><span key={i} style={{fontSize:11,padding:"3px 10px",border:`1px solid ${modal.accent}28`,borderRadius:5,color:modal.accent}}>{t}</span>)}
              </div>
              <a href={modal.github} target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 18px",border:`1px solid ${modal.accent}30`,borderRadius:8,color:modal.accent,fontSize:12,fontFamily:"var(--font-mono)",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${modal.accent}10`;e.currentTarget.style.borderColor=`${modal.accent}55`}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=`${modal.accent}30`}}>
                {GH}&nbsp;View on GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}