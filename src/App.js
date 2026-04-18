import { useEffect, useRef, useState, useCallback } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Space Grotesk', sans-serif; background: #030508; color: #e8edf5; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    a { text-decoration: none; color: inherit; }
    ::selection { background: rgba(59,130,246,0.25); }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 2px; }

    #prog { position: fixed; top: 0; left: 0; height: 2px; background: #3b82f6; width: 0%; z-index: 9999; transition: width 0.1s linear; box-shadow: 0 0 10px #3b82f6; }
    #particles { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

    /* ── NAV ── */
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 58px; background: rgba(3,5,8,0.92); border-bottom: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(20px); }
    .nav-logo { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: none; border: none; }
    .nav-logo span { color: #3b82f6; }
    .nav-links { display: flex; gap: 32px; }
    .nav-link { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; background: none; border: none; }
    .nav-link:hover, .nav-link.active { color: #3b82f6; }
    .nav-resume { padding: 7px 16px; border: 1px solid rgba(59,130,246,0.45); border-radius: 3px; font-family: 'DM Mono', monospace; font-size: 11px; color: #3b82f6; background: rgba(59,130,246,0.07); cursor: pointer; letter-spacing: 0.08em; transition: all 0.2s; text-decoration: none; display: inline-block; }
    .nav-resume:hover { background: rgba(59,130,246,0.16); }
    .nav-ham { display: none; flex-direction: column; gap: 4px; background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 8px 9px; cursor: pointer; }
    .ham-l { width: 18px; height: 1.5px; background: rgba(255,255,255,0.6); border-radius: 1px; transition: all 0.22s; }

    /* ── DRAWER ── */
    .mob-drawer { position: fixed; top: 0; left: 0; bottom: 0; z-index: 200; width: 268px; background: #06090f; border-right: 1px solid rgba(255,255,255,0.06); padding: 72px 22px 36px; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.22,1,0.36,1); }
    .mob-drawer.open { transform: translateX(0); }
    .mob-overlay { position: fixed; inset: 0; z-index: 190; background: rgba(0,0,0,0.72); backdrop-filter: blur(4px); display: none; }
    .mob-overlay.open { display: block; }
    .mob-link { display: flex; align-items: center; gap: 12px; padding: 12px 10px; border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: none; border: none; width: 100%; text-align: left; margin-bottom: 2px; transition: all 0.18s; }
    .mob-link:hover { background: rgba(59,130,246,0.08); color: #3b82f6; }
    .mob-link-num { font-size: 9px; color: #3b82f6; width: 20px; }

    .main { position: relative; z-index: 1; padding-top: 58px; }

    /* ══════════════════════════════
       HERO — TWO COLUMN
    ══════════════════════════════ */
    .hero { position: relative; padding: 0 48px; min-height: calc(100vh - 58px); display: grid; grid-template-columns: 1fr 420px; gap: 0; align-items: center; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 110%, rgba(59,130,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 82% 8%, rgba(59,130,246,0.08) 0%, transparent 38%), radial-gradient(ellipse at 14% 52%, rgba(25,55,110,0.13) 0%, transparent 42%); z-index: 0; }
    .hero-grid-lines { position: absolute; inset: 0; z-index: 0; opacity: 0.022; background-image: linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px); background-size: 58px 58px; }

    .hero-left { position: relative; z-index: 2; padding: 60px 0; }
    .hero-tag { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px; border: 1px solid rgba(59,130,246,0.28); border-radius: 2px; margin-bottom: 24px; background: rgba(59,130,246,0.06); animation: fadeUp 0.6s ease both; }
    .tag-dot { width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 10px #3b82f6; animation: glow 2.2s infinite; }
    @keyframes glow { 0%,100%{box-shadow:0 0 8px #3b82f6} 50%{box-shadow:0 0 20px #3b82f6,0 0 35px rgba(59,130,246,0.38)} }
    .tag-txt { font-family: 'DM Mono', monospace; font-size: 10px; color: #3b82f6; letter-spacing: 0.1em; text-transform: uppercase; }
    .hero-name { font-size: clamp(62px, 8.5vw, 104px); font-weight: 700; line-height: 0.88; letter-spacing: -3px; color: #fff; margin-bottom: 6px; animation: fadeUp 0.6s 0.08s ease both; }
    .hero-name .blue { color: #3b82f6; }
    .hero-name .dim { color: rgba(255,255,255,0.14); }
    .hero-sub-row { display: flex; align-items: center; gap: 16px; margin-top: 22px; margin-bottom: 20px; animation: fadeUp 0.6s 0.16s ease both; flex-wrap: wrap; }
    .hero-role { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }
    .hero-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(59,130,246,0.35), transparent); max-width: 100px; }
    .tw-txt { color: #3b82f6; }
    .tw-cur { color: #3b82f6; animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .hero-desc { font-size: 16px; color: rgba(255,255,255,0.44); line-height: 1.85; max-width: 500px; margin-bottom: 32px; animation: fadeUp 0.6s 0.24s ease both; }
    .hero-desc strong { color: rgba(255,255,255,0.82); font-weight: 500; }
    .hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; animation: fadeUp 0.6s 0.32s ease both; }
    .btn-primary { padding: 12px 28px; background: #3b82f6; border: none; border-radius: 3px; font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.2s; }
    .btn-primary:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
    .btn-ghost { padding: 12px 28px; background: transparent; border: 1px solid rgba(255,255,255,0.14); border-radius: 3px; font-family: 'Space Grotesk', sans-serif; font-size: 13px; color: rgba(255,255,255,0.45); cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.2s; }
    .btn-ghost:hover { border-color: rgba(59,130,246,0.45); color: #3b82f6; }
    .scroll-hint { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .scroll-line { width: 32px; height: 1px; background: rgba(255,255,255,0.12); }
    .scroll-txt { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.18); letter-spacing: 0.14em; }

    /* ── 3D FLOATING OBJECT ── */
    .hero-right { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; height: 100%; }
    .hero-3d-wrap { position: relative; width: 340px; height: 340px; }
    .hero-3d-canvas { width: 100%; height: 100%; }

    /* ── STATS BAR ── */
    .stats-bar { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; z-index: 1; }
    .stat { padding: 20px 16px; border-right: 1px solid rgba(255,255,255,0.05); text-align: center; transition: background 0.2s; position: relative; overflow: hidden; }
    .stat:last-child { border-right: none; }
    .stat::after { content:''; position: absolute; top: 0; left: 50%; transform: translateX(-50%) scaleX(0); width: 36%; height: 1px; background: #3b82f6; transition: transform 0.3s; }
    .stat:hover::after { transform: translateX(-50%) scaleX(1); }
    .stat:hover { background: rgba(59,130,246,0.04); }
    .stat-n { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    .stat-l { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.22); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px; }

    /* ── MARQUEE ── */
    .mq-wrap { overflow: hidden; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); padding: 11px 0; background: rgba(59,130,246,0.018); position: relative; z-index: 1; }
    .mq-track { display: flex; animation: mq 30s linear infinite; white-space: nowrap; }
    .mq-item { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.16); padding: 0 20px; letter-spacing: 0.1em; }
    .mq-item.hl { color: #3b82f6; }
    @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }

    /* ── SECTIONS ── */
    .section { padding: 72px 48px; border-top: 1px solid rgba(255,255,255,0.04); position: relative; z-index: 1; }
    .sec-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
    .sec-num { font-family: 'DM Mono', monospace; font-size: 11px; color: #3b82f6; }
    .sec-lbl { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.15em; text-transform: uppercase; }
    .sec-title { font-size: clamp(28px,3.5vw,42px); font-weight: 700; color: #fff; margin-bottom: 36px; letter-spacing: -1px; line-height: 1.1; }

    /* ── ABOUT ── */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    .about-txt { font-size: 16px; color: rgba(255,255,255,0.46); line-height: 1.9; margin-bottom: 16px; }
    .about-txt strong { color: rgba(255,255,255,0.85); font-weight: 500; }
    .cpill { display: inline-block; font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 9px; border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; color: rgba(255,255,255,0.38); margin: 2px; }
    .info-table { width: 100%; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; margin-bottom: 14px; }
    .info-row { display: flex; padding: 11px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .info-row:last-child { border-bottom: none; }
    .info-row:nth-child(even) { background: rgba(255,255,255,0.018); }
    .info-k { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.22); width: 72px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.07em; padding-top: 1px; }
    .info-v { font-size: 13px; color: rgba(255,255,255,0.62); }
    .info-v.green { color: #22c55e; }
    .cert-item { display: flex; gap: 12px; align-items: center; padding: 11px 14px; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; margin-bottom: 8px; transition: border-color 0.18s; }
    .cert-item:hover { border-color: rgba(59,130,246,0.3); }
    .cert-icon { width: 30px; height: 30px; border-radius: 4px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
    .cert-name { font-size: 12px; color: rgba(255,255,255,0.6); }
    .cert-org { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.22); margin-top: 2px; }

    /* ══════════════════════════════
       PROJECTS — GLASS CARDS
    ══════════════════════════════ */
    .proj-glass-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
    .proj-glass-card {
      position: relative; overflow: hidden;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 28px;
      cursor: pointer;
      transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
      backdrop-filter: blur(12px);
    }
    .proj-glass-card::before {
      content: ''; position: absolute; inset: 0; border-radius: 16px;
      background: radial-gradient(circle at 30% 30%, rgba(59,130,246,0.12) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.28s;
    }
    .proj-glass-card:hover { border-color: rgba(59,130,246,0.35); transform: translateY(-4px); box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.12); }
    .proj-glass-card:hover::before { opacity: 1; }
    .proj-glass-card.featured { border-left: 3px solid #3b82f6; }
    .pgc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .pgc-num { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.22); }
    .pgc-tag { font-family: 'DM Mono', monospace; font-size: 9px; padding: 3px 9px; border: 1px solid rgba(59,130,246,0.28); border-radius: 2px; color: #3b82f6; background: rgba(59,130,246,0.07); }
    .pgc-title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 10px; letter-spacing: -0.3px; }
    .pgc-desc { font-size: 14px; color: rgba(255,255,255,0.44); line-height: 1.75; margin-bottom: 18px; }
    .pgc-techs { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
    .pgc-tech { font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 8px; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; color: rgba(255,255,255,0.38); }
    .pgc-footer { display: flex; justify-content: space-between; align-items: center; }
    .pgc-metrics { display: flex; gap: 8px; }
    .pgc-metric { font-family: 'DM Mono', monospace; font-size: 10px; color: #3b82f6; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.18); border-radius: 3px; padding: 2px 8px; }
    .pgc-arrow { font-size: 13px; color: rgba(59,130,246,0.5); transition: all 0.2s; }
    .proj-glass-card:hover .pgc-arrow { color: #3b82f6; transform: translate(2px,-2px); }

    /* ── EXPERIENCE ── */
    .exp-card { border: 1px solid rgba(59,130,246,0.2); border-left: 3px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 26px 28px; background: rgba(59,130,246,0.028); }
    .exp-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
    .exp-company { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 5px; }
    .exp-role-txt { font-size: 15px; color: rgba(255,255,255,0.46); }
    .exp-org { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.22); margin-top: 4px; }
    .exp-date { font-family: 'DM Mono', monospace; font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 3px; color: rgba(255,255,255,0.32); white-space: nowrap; }
    .exp-bullets { list-style: none; margin-bottom: 18px; }
    .exp-bullets li { display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.44); line-height: 1.85; margin-bottom: 6px; }
    .exp-bullets li::before { content: '—'; color: #3b82f6; flex-shrink: 0; }
    .exp-techs { display: flex; flex-wrap: wrap; gap: 6px; }
    .etag { font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 9px; border: 1px solid rgba(255,255,255,0.09); border-radius: 2px; color: rgba(255,255,255,0.32); }
    .avail-banner { margin-top: 14px; padding: 13px 18px; border: 1px solid rgba(34,197,94,0.15); border-radius: 6px; background: rgba(34,197,94,0.04); display: flex; align-items: center; gap: 10px; }
    .avail-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; box-shadow: 0 0 9px #22c55e; animation: pulse 2.5s infinite; }

    /* ══════════════════════════════
       SKILLS — NO PROFICIENCY BARS
       just categories with tags
    ══════════════════════════════ */
    .skills-cats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 48px; }
    .skill-cat-row { display: flex; gap: 16px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .skill-cat-row:last-child { border-bottom: none; }
    .cat-lbl { font-family: 'DM Mono', monospace; font-size: 10px; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; width: 90px; flex-shrink: 0; padding-top: 4px; }
    .cat-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-pill { font-family: 'DM Mono', monospace; font-size: 11px; padding: 4px 11px; border: 1px solid rgba(255,255,255,0.09); border-radius: 3px; color: rgba(255,255,255,0.55); transition: all 0.18s; background: rgba(255,255,255,0.02); }
    .skill-pill:hover { border-color: rgba(59,130,246,0.4); color: rgba(255,255,255,0.9); background: rgba(59,130,246,0.06); }

    /* ── CONTACT ── */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 32px; }
    .clinks { display: flex; flex-direction: column; gap: 8px; }
    .clink { display: flex; align-items: center; justify-content: space-between; padding: 15px 16px; border: 1px solid rgba(255,255,255,0.07); border-radius: 7px; background: rgba(255,255,255,0.018); transition: all 0.18s; cursor: pointer; text-decoration: none; color: inherit; }
    .clink:hover { border-color: rgba(59,130,246,0.4); background: rgba(59,130,246,0.05); transform: translateX(4px); }
    .clink-l { display: flex; align-items: center; gap: 12px; }
    .clink-ico { width: 34px; height: 34px; border-radius: 6px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; color: #3b82f6; flex-shrink: 0; }
    .clink-lbl { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.22); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3px; }
    .clink-val { font-size: 13px; color: rgba(255,255,255,0.65); font-weight: 500; }
    .clink-arr { font-size: 13px; color: rgba(59,130,246,0.4); }
    .form-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 24px; }
    .flbl { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.24); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }
    .finput { width: 100%; padding: 11px 13px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 5px; font-size: 13px; color: rgba(255,255,255,0.65); font-family: 'Space Grotesk', sans-serif; margin-bottom: 13px; outline: none; transition: border-color 0.2s; }
    .finput:focus { border-color: rgba(59,130,246,0.45); }
    .finput::placeholder { color: rgba(255,255,255,0.2); }
    .fsubmit { width: 100%; padding: 12px; background: #3b82f6; border: none; border-radius: 5px; font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.2s; }
    .fsubmit:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(59,130,246,0.3); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .form-err { font-size: 12px; color: #f87171; margin-bottom: 10px; }

    /* ── FOOTER ── */
    .footer { padding: 18px 48px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; position: relative; z-index: 1; }
    .footer-l { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.18); letter-spacing: 0.06em; }

    /* ── MODAL ── */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(14px); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
    .modal-overlay.open { opacity: 1; pointer-events: all; }
    .modal-box { background: #080c14; border: 1px solid rgba(59,130,246,0.2); border-radius: 12px; padding: clamp(20px,4vw,36px); max-width: 580px; width: 100%; max-height: 88vh; overflow-y: auto; position: relative; transform: scale(0.94) translateY(16px); opacity: 0; transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
    .modal-overlay.open .modal-box { transform: none; opacity: 1; }
    .modal-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 5px; width: 30px; height: 30px; cursor: pointer; color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.18s; }
    .modal-close:hover { background: rgba(59,130,246,0.12); color: #3b82f6; }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.28} }
    @keyframes float3d { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-12px) rotate(3deg)} 66%{transform:translateY(6px) rotate(-2deg)} }
    .reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .reveal.in { opacity: 1; transform: none; }

    /* ── MOBILE BOTTOM NAV ── */
    .mob-bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: rgba(3,5,8,0.96); border-top: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(20px); padding: 5px 0 env(safe-area-inset-bottom,5px); }
    .mbn-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.24); font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.05em; transition: color 0.18s; padding: 5px 2px; }
    .mbn-btn.active, .mbn-btn:hover { color: #3b82f6; }
    .mbn-icon { font-size: 17px; line-height: 1; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1100px) {
      .hero { grid-template-columns: 1fr 340px; }
      .hero-3d-wrap { width: 280px; height: 280px; }
    }
    @media (max-width: 900px) {
      .nav { padding: 0 22px; }
      .nav-links, .nav-resume { display: none; }
      .nav-ham { display: flex; }
      .hero { grid-template-columns: 1fr; padding: 36px 22px 32px; min-height: auto; }
      .hero-right { display: none; }
      .hero-name { font-size: clamp(52px,14vw,80px); letter-spacing: -2px; }
      .scroll-hint { display: none; }
      .stats-bar { grid-template-columns: repeat(2,1fr); }
      .stat:nth-child(2) { border-right: none; }
      .stat:nth-child(3) { border-right: 1px solid rgba(255,255,255,0.05); }
      .stat:nth-child(1),.stat:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.05); }
      .section { padding: 52px 22px; }
      .about-grid { grid-template-columns: 1fr; gap: 28px; }
      .proj-glass-grid { grid-template-columns: 1fr; }
      .skills-cats-grid { grid-template-columns: 1fr; }
      .contact-grid { grid-template-columns: 1fr; gap: 22px; }
      .form-row { grid-template-columns: 1fr; }
      .footer { padding: 14px 22px; flex-direction: column; align-items: flex-start; gap: 5px; }
      .mob-bottom-nav { display: flex; }
      .main { padding-bottom: 58px; }
    }
    @media (max-width: 600px) {
      .hero { padding: 28px 16px 26px; }
      .hero-name { font-size: clamp(44px,15vw,66px); letter-spacing: -1.5px; }
      .hero-desc { font-size: 14px; }
      .btn-primary, .btn-ghost { padding: 10px 20px; font-size: 12px; }
      .section { padding: 44px 16px; }
      .sec-title { font-size: clamp(24px,6vw,32px); }
      .pgc-title { font-size: 18px; }
      .footer { padding: 12px 16px; }
    }
    @media (max-width: 380px) {
      .hero-name { font-size: 40px; }
      .btn-primary, .btn-ghost { padding: 9px 16px; font-size: 11px; }
    }
  `}</style>
);

/* ── DATA ── */
const PROJECTS = {
  'TicketFlow': { num:'01', status:'ONGOING', tag:'DISTRIBUTED SYSTEMS', desc:'Distributed ticket booking handling 5K+ concurrent users. Redis seat locking, Kafka async pipelines, JWT RBAC security.', detail:'Designed a distributed ticket booking system handling 5K+ concurrent users with sub-200ms latency. Implemented Redis-based distributed seat locking (SET NX + TTL 10 min) to prevent race conditions. Built event-driven architecture using Apache Kafka. Secured APIs using stateless JWT authentication with RBAC and BCrypt encryption.', arch:'Event-Driven Microservices', tech:['Spring Boot','MySQL','Redis','Kafka','JWT'], metrics:['5K users','<200ms'], github:'https://github.com/yashpatil1816', featured:true },
  'Transaction Insight Engine': { num:'02', status:'BUILT', tag:'AGENTIC AI', desc:'Real-time UPI fraud detection. 4-rule engine routes 85% of transactions. LangChain4j handles uncertain cases in <100ms.', detail:'Designed a real-time fraud detection pipeline using Kafka for async event streaming and Redis for per-user transaction caching. Built a 4-rule deterministic engine. Integrated LangChain4j agentic loop for uncertain cases with step-by-step reasoning and MySQL audit logs.', arch:'Agentic AI + Event-Driven', tech:['Java 17','Kafka','LangChain4j','Redis','Spring AI','JWT'], metrics:['<100ms','85% routed'], github:'https://github.com/yashpatil1816', featured:false },
  'J.P. Morgan SWE': { num:'03', status:'JAN 2025', tag:'VIRTUAL · FORAGE', desc:'Software engineering simulation: Java + Spring Boot REST APIs, Apache Kafka async messaging, JPA entities with H2.', detail:'Completed J.P. Morgan Chase & Co. Software Engineering Virtual Experience on Forage. Developed backend services using Java and Spring Boot. Integrated Apache Kafka. Applied Controller–Service–Repository layered architecture.', arch:'Controller – Service – Repository', tech:['Java','Spring Boot','Apache Kafka','JPA','H2'], metrics:['REST APIs','Kafka'], github:'https://github.com/yashpatil1816', featured:false },
  'WeatherSphere': { num:'04', status:'2024', tag:'API INTEGRATION', desc:'Real-time weather proxy service. OpenWeatherMap REST API integration with routing, transformation, and error handling.', detail:'Spring Boot service acting as a proxy to OpenWeatherMap REST API. Handles request routing, response transformation, error management, and JSON deserialization.', arch:'API Proxy + Transform', tech:['Java','Spring Boot','REST API','OpenWeatherMap'], metrics:['Live API','Proxy'], github:'https://github.com/yashpatil1816', featured:false }
};

const SKILL_CATS = [
  { lbl:'Languages', items:['Java','JavaScript','SQL','Python'] },
  { lbl:'Frameworks', items:['Spring Boot','Spring Security','Spring Data JPA','Hibernate'] },
  { lbl:'Infra', items:['Apache Kafka','Redis','Docker','Jenkins','GitHub Actions'] },
  { lbl:'Databases', items:['MySQL','H2','Redis Cache'] },
  { lbl:'AI / ML', items:['LangChain4j','Spring AI','Generative AI'] },
  { lbl:'Testing', items:['JUnit','TestNG','Postman','API Testing'] },
  { lbl:'Concepts', items:['Microservices','REST APIs','CI/CD','Distributed Systems','Event-Driven','JWT & RBAC'] },
];

const MQ = ['Java','·','Spring Boot','·','Apache Kafka','·','Redis','·','LangChain4j','·','Microservices','·','Spring Security','·','JWT & RBAC','·','MySQL','·','REST APIs','·','Docker','·','CI/CD','·'];
const MQ_HL = new Set(['Java','Apache Kafka','LangChain4j','Spring Security','MySQL','Docker']);
const TW_WORDS = ['Spring Boot Engineer','Distributed Systems','Agentic AI Builder','REST API Specialist'];

/* ── TYPEWRITER ── */
function Typewriter() {
  const [idx,setIdx]=useState(0);const[sub,setSub]=useState(0);const[del,setDel]=useState(false);
  useEffect(()=>{const w=TW_WORDS[idx];let t;if(!del&&sub<w.length)t=setTimeout(()=>setSub(s=>s+1),65);else if(!del)t=setTimeout(()=>setDel(true),2200);else if(sub>0)t=setTimeout(()=>setSub(s=>s-1),28);else{setDel(false);setIdx(i=>(i+1)%TW_WORDS.length);}return()=>clearTimeout(t);},[idx,sub,del]);
  return <><span className="tw-txt">{TW_WORDS[idx].slice(0,sub)}</span><span className="tw-cur">|</span></>;
}

/* ── PARTICLES ── */
function ParticleCanvas() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext('2d'); let W, H, mouse = { x: 0, y: 0 };
    const pts = [];
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    for (let i = 0; i < 80; i++) pts.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.1 + 0.3, o: Math.random() * 0.3 + 0.05 });
    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.sqrt(dx*dx + dy*dy);
        if (d < 160) { p.vx += dx/d*0.01; p.vy += dy/d*0.01; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(59,130,246,${p.o})`; ctx.fill();
      });
      pts.forEach((a, i) => {
        for (let j = i+1; j < pts.length; j++) {
          const b = pts[j], dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < 100) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle = `rgba(59,130,246,${0.055*(1-d/100)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas id="particles" ref={ref} />;
}

/* ── 3D FLOATING OBJECT (Canvas) ── */
function Hero3D() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 340; const H = canvas.height = 340;
    let angle = 0;
    let raf;

    const drawCube = (cx, cy, size, rotX, rotY, alpha) => {
      const cos = Math.cos, sin = Math.sin;
      const verts = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
        [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1]
      ].map(([x,y,z]) => {
        const y2 = y*cos(rotX) - z*sin(rotX), z2 = y*sin(rotX) + z*cos(rotX);
        const x3 = x*cos(rotY) + z2*sin(rotY), z3 = -x*sin(rotY) + z2*cos(rotY);
        const fov = 320; const depth = fov / (fov + z3 * size);
        return { sx: cx + x3 * size * depth, sy: cy + y2 * size * depth, depth: z3 };
      });
      const faces = [
        [0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]
      ];
      const faceColors = [
        `rgba(59,130,246,${alpha*0.35})`,`rgba(37,99,235,${alpha*0.25})`,
        `rgba(96,165,250,${alpha*0.2})`,`rgba(29,78,216,${alpha*0.3})`,
        `rgba(59,130,246,${alpha*0.15})`,`rgba(147,197,253,${alpha*0.18})`
      ];
      faces.forEach((face, fi) => {
        const pts = face.map(i => verts[i]);
        ctx.beginPath();
        ctx.moveTo(pts[0].sx, pts[0].sy);
        pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.fillStyle = faceColors[fi];
        ctx.fill();
        ctx.strokeStyle = `rgba(59,130,246,${alpha*0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    };

    const drawSphere = (cx, cy, r, gx, gy, alpha) => {
      const grad = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.1, cx, cy, r);
      grad.addColorStop(0, `rgba(96,165,250,${alpha*0.7})`);
      grad.addColorStop(0.5, `rgba(37,99,235,${alpha*0.4})`);
      grad.addColorStop(1, `rgba(15,23,42,${alpha*0.2})`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = `rgba(59,130,246,${alpha*0.4})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      angle += 0.008;

      // Outer glow
      const glow = ctx.createRadialGradient(W/2, H/2, 40, W/2, H/2, 160);
      glow.addColorStop(0, 'rgba(59,130,246,0.08)');
      glow.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Main big cube
      drawCube(W/2, H/2, 72, angle*0.7, angle, 1);

      // Orbiting small cube
      const orbitR = 110;
      const ox = W/2 + Math.cos(angle*1.4) * orbitR;
      const oy = H/2 + Math.sin(angle*1.4) * orbitR * 0.4;
      drawCube(ox, oy, 24, angle*1.2, angle*0.8, 0.7);

      // Floating spheres
      const s1x = W/2 + Math.cos(angle*0.6 + 1) * 90;
      const s1y = H/2 + Math.sin(angle*0.9 + 1) * 70;
      drawSphere(s1x, s1y, 16, s1x, s1y, 0.85);

      const s2x = W/2 + Math.cos(angle*0.5 + 3) * 108;
      const s2y = H/2 + Math.sin(angle*0.7 + 3) * 55;
      drawSphere(s2x, s2y, 10, s2x, s2y, 0.65);

      // Ring
      ctx.save();
      ctx.translate(W/2, H/2);
      ctx.rotate(angle * 0.3);
      ctx.scale(1, 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, 128, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(59,130,246,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Outer ring dashed
      ctx.save();
      ctx.translate(W/2, H/2);
      ctx.rotate(-angle * 0.15);
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.setLineDash([6, 14]);
      ctx.arc(0, 0, 148, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(59,130,246,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="hero-3d-canvas" width={340} height={340} />;
}

/* ── MODAL ── */
function Modal({ name, onClose }) {
  const p = name ? PROJECTS[name] : null;
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div className={`modal-overlay${p ? ' open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {p && (<>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.24)' }}>{p.num} · {p.status}</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'3px 9px', border:'1px solid rgba(59,130,246,0.28)', borderRadius:2, color:'#3b82f6', background:'rgba(59,130,246,0.07)' }}>{p.tag}</span>
          </div>
          <h3 style={{ fontSize:'clamp(20px,3vw,27px)', fontWeight:700, color:'#fff', marginBottom:14, letterSpacing:'-0.5px' }}>{name}</h3>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.44)', lineHeight:1.9, marginBottom:18 }}>{p.detail}</p>
          <div style={{ marginBottom:14 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Architecture</span>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:5 }}>{p.arch}</p>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
            {p.metrics.map(m => <span key={m} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#3b82f6', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:3, padding:'3px 9px' }}>{m}</span>)}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:22 }}>
            {p.tech.map(t => <span key={t} className="etag">{t}</span>)}
          </div>
          <a href={p.github} target="_blank" rel="noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.44)', letterSpacing:'0.08em', transition:'all 0.18s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='rgba(59,130,246,0.45)'; e.currentTarget.style.color='#3b82f6'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.44)'; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            VIEW ON GITHUB
          </a>
        </>)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP
══════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState('hero');
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', msg:'' });
  const [formErr, setFormErr] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const bar = document.getElementById('prog');
      if (bar) bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
      const SECS = ['hero','about','projects','experience','skills','contact'];
      let cur = 'hero';
      SECS.forEach(id => { const s = document.getElementById(id); if (s && s.getBoundingClientRect().top < 120) cur = id; });
      setActive(cur);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => { document.body.style.overflow = modal ? 'hidden' : ''; }, [modal]);

  const goto = useCallback(id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setDrawer(false); }, []);

  const sendMsg = () => {
    if (!form.name || !form.email || !form.msg) { setFormErr(true); return; }
    setFormErr(false);
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.msg}`);
    window.location.href = `mailto:yashpatil2571@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setForm({ name:'', email:'', msg:'' });
  };

  const mqDouble = [...MQ, ...MQ];

  return (
    <>
      <GlobalStyle />
      <div id="prog" />
      <ParticleCanvas />

      {/* NAV */}
      <nav className="nav">
        <button className="nav-logo" onClick={() => goto('hero')}>YASH<span>.</span>PATIL</button>
        <div className="nav-links">
          {['about','skills','projects','experience','contact'].map(s => (
            <button key={s} className={`nav-link ${active===s?'active':''}`} onClick={() => goto(s)}>{s}</button>
          ))}
        </div>
        <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="nav-resume">↓ RESUME</a>
        <button className="nav-ham" onClick={() => setDrawer(d => !d)} aria-label="Menu">
          <div className="ham-l" style={{ transform: drawer?'rotate(45deg) translate(3.5px,3.5px)':'' }} />
          <div className="ham-l" style={{ transform: drawer?'scaleX(0)':'' }} />
          <div className="ham-l" style={{ transform: drawer?'rotate(-45deg) translate(3.5px,-3.5px)':'' }} />
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mob-overlay ${drawer?'open':''}`} onClick={() => setDrawer(false)} />
      <div className={`mob-drawer ${drawer?'open':''}`}>
        {[['hero','00','Home'],['about','01','About'],['skills','02','Skills'],['projects','03','Projects'],['experience','04','Experience'],['contact','05','Contact']].map(([id,num,label]) => (
          <button key={id} className="mob-link" onClick={() => goto(id)}><span className="mob-link-num">{num}</span>{label}</button>
        ))}
        <div style={{ marginTop:22, padding:'0 10px' }}>
          <a href="https://drive.google.com/file/d/1xboyFm7F2BcgQP7-cH7tG4eqwKYwUfRz/view?usp=drive_link" target="_blank" rel="noreferrer" className="btn-primary" style={{ display:'block', textAlign:'center', fontSize:12, borderRadius:4 }}>↓ DOWNLOAD RESUME</a>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mob-bottom-nav">
        {[['hero','⌂','Home'],['about','◎','About'],['skills','◈','Skills'],['projects','◻','Work'],['contact','◉','Contact']].map(([id,icon,label]) => (
          <button key={id} className={`mbn-btn ${active===id?'active':''}`} onClick={() => goto(id)}><span className="mbn-icon">{icon}</span>{label}</button>
        ))}
      </nav>

      <main className="main">

        {/* ══ HERO ══ */}
        <section id="hero" className="hero">
          <div className="hero-bg" />
          <div className="hero-grid-lines" />

          <div className="hero-left">
            <div className="hero-tag"><span className="tag-dot" /><span className="tag-txt">Available · Pune, India · B.Tech IT 2027</span></div>
            <div className="hero-name">
              <div>YASH</div>
              <div><span className="blue">PATIL</span><span className="dim">.</span></div>
            </div>
            <div className="hero-sub-row">
              <span className="hero-role">Java Backend Developer</span>
              <div className="hero-line" />
              <span className="hero-role"><Typewriter /></span>
            </div>
            <p className="hero-desc">
              Building <strong>distributed systems</strong> that scale — from <strong>5K+ concurrent</strong> ticket bookings to <strong>sub-100ms fraud detection</strong> with Agentic AI. I engineer backends that are fast, fault-tolerant, and production-ready.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => goto('projects')}>View Projects</button>
              <button className="btn-ghost" onClick={() => goto('contact')}>Let's Connect</button>
              <div className="scroll-hint"><div className="scroll-line" /><span className="scroll-txt">SCROLL</span></div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-3d-wrap">
              <Hero3D />
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-bar reveal">
          {[['200+','DSA Solved'],['8.18','CGPA'],['5K+','Concurrent Users'],['2027','Graduating']].map(([n,l]) => (
            <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>

        {/* MARQUEE */}
        <div className="mq-wrap">
          <div className="mq-track">
            {mqDouble.map((item,i) => <span key={i} className={`mq-item${MQ_HL.has(item)?' hl':''}`}>{item}</span>)}
          </div>
        </div>

        {/* ══ ABOUT ══ */}
        <section id="about" className="section reveal">
          <div className="sec-header"><span className="sec-num">01 —</span><span className="sec-lbl">About</span></div>
          <h2 className="sec-title">Backends Built<br/>for Production</h2>
          <div className="about-grid">
            <div>
              <p className="about-txt">I'm a <strong>Java Backend Developer</strong> pursuing B.Tech in Information Technology at G.H. Raisoni College of Engineering, Pune. My work sits at the intersection of distributed systems, event-driven architecture, and applied AI.</p>
              <p className="about-txt">Whether it's preventing race conditions with <strong>Redis distributed locking</strong>, routing transactions through a <strong>Kafka pipeline</strong>, or deploying a <strong>LangChain4j agentic loop</strong> for intelligent fraud detection — I design for scale and resilience.</p>
              <div style={{ marginTop:16, display:'flex', flexWrap:'wrap', gap:5 }}>
                {['OOP','REST','Microservices','JWT','Spring Security','Kafka','Redis','DSA','Docker','CI/CD'].map(t => <span key={t} className="cpill">{t}</span>)}
              </div>
            </div>
            <div>
              <div className="info-table">
                {[['Role','Java Backend Developer'],['Location','Pune, India'],['Degree','B.Tech IT — G.H. Raisoni'],['CGPA','8.18 / 10'],['Grad','Expected 2027'],['Status','Open to Work ✓',true]].map(([k,v,g]) => (
                  <div key={k} className="info-row"><span className="info-k">{k}</span><span className={`info-v${g?' green':''}`}>{v}</span></div>
                ))}
              </div>
              {[['🏅','Oracle Cloud AI Foundations','Oracle Cloud Infrastructure · 2025'],['📜','Spring Boot, MVC & Hibernate','Udemy · Feb 2026'],['📜','Java Full Stack Development','Code For Success · Oct 2025']].map(([ico,name,org]) => (
                <div key={name} className="cert-item"><div className="cert-icon">{ico}</div><div><div className="cert-name">{name}</div><div className="cert-org">{org}</div></div></div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SKILLS — NO PROFICIENCY ══ */}
        <section id="skills" className="section reveal">
          <div className="sec-header"><span className="sec-num">02 —</span><span className="sec-lbl">Skills</span></div>
          <h2 className="sec-title">Tech Stack</h2>
          <div className="skills-cats-grid">
            {SKILL_CATS.map(cat => (
              <div key={cat.lbl} className="skill-cat-row">
                <span className="cat-lbl">{cat.lbl}</span>
                <div className="cat-pills">
                  {cat.items.map(item => <span key={item} className="skill-pill">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ PROJECTS — GLASS CARDS ══ */}
        <section id="projects" className="section reveal">
          <div className="sec-header"><span className="sec-num">03 —</span><span className="sec-lbl">Projects</span></div>
          <h2 className="sec-title">Selected Work</h2>
          <div className="proj-glass-grid">
            {Object.entries(PROJECTS).map(([name, p]) => (
              <div key={name} className={`proj-glass-card${p.featured?' featured':''}`} onClick={() => setModal(name)}>
                <div className="pgc-top">
                  <span className="pgc-num">{p.num} · {p.status}</span>
                  <span className="pgc-tag">{p.tag}</span>
                </div>
                <div className="pgc-title">{name}</div>
                <div className="pgc-desc">{p.desc}</div>
                <div className="pgc-techs">
                  {p.tech.map(t => <span key={t} className="pgc-tech">{t}</span>)}
                </div>
                <div className="pgc-footer">
                  <div className="pgc-metrics">
                    {p.metrics.map(m => <span key={m} className="pgc-metric">{m}</span>)}
                  </div>
                  <span className="pgc-arrow">↗</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ EXPERIENCE ══ */}
        <section id="experience" className="section reveal">
          <div className="sec-header"><span className="sec-num">04 —</span><span className="sec-lbl">Experience</span></div>
          <h2 className="sec-title">Professional Experience</h2>
          <div className="exp-card">
            <div className="exp-top">
              <div>
                <div className="exp-company">J.P. Morgan Chase & Co.</div>
                <div className="exp-role-txt">Software Engineering Virtual Experience</div>
                <div className="exp-org">Forage (Virtual Program)</div>
              </div>
              <span className="exp-date">JAN 2025</span>
            </div>
            <ul className="exp-bullets">
              {['Developed backend services using Java and Spring Boot, handling REST APIs and improving response efficiency.',
                'Integrated Apache Kafka for asynchronous communication, improving scalability and service decoupling.',
                'Modeled relational entities using Spring Data JPA and persisted data in H2 database.',
                'Applied layered architecture (Controller–Service–Repository) for clean and modular design.'
              ].map((b,i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="exp-techs">
              {['Java','Spring Boot','Apache Kafka','JPA','H2'].map(t => <span key={t} className="etag">{t}</span>)}
            </div>
          </div>
          <div className="avail-banner">
            <span className="avail-dot" />
            <span style={{ fontSize:14, color:'rgba(255,255,255,0.44)' }}>Currently available — open to Java Backend, SWE & Internship roles.</span>
          </div>
        </section>

        {/* ══ CONTACT ══ */}
        <section id="contact" className="section reveal">
          <div className="sec-header"><span className="sec-num">05 —</span><span className="sec-lbl">Contact</span></div>
          <h2 className="sec-title">Let's Build Something <span style={{ color:'#3b82f6' }}>Great.</span></h2>
          <div className="contact-grid">
            <div className="clinks">
              {[
                ['GH','GitHub','yashpatil1816','https://github.com/yashpatil1816'],
                ['LI','LinkedIn','yash-patil-39941a326','https://www.linkedin.com/in/yash-patil-39941a326/'],
                ['@','Email','yashpatil2571@gmail.com','mailto:yashpatil2571@gmail.com'],
                ['☎','Phone','+91 9022046356','tel:+919022046356'],
                ['LC','LeetCode','200+ Problems Solved','https://leetcode.com'],
              ].map(([ico,lbl,val,url]) => (
                <a key={lbl} href={url} target={url.startsWith('http')?'_blank':undefined} rel="noreferrer" className="clink">
                  <div className="clink-l"><div className="clink-ico">{ico}</div><div><div className="clink-lbl">{lbl}</div><div className="clink-val">{val}</div></div></div>
                  <span className="clink-arr">↗</span>
                </a>
              ))}
            </div>
            <div className="form-box">
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.24)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:18 }}>Send a message — goes directly to my inbox</div>
              {sent ? (
                <div style={{ textAlign:'center', padding:'44px 0' }}>
                  <div style={{ fontSize:38, marginBottom:14 }}>✉️</div>
                  <p style={{ fontSize:19, fontWeight:600, color:'#fff', marginBottom:8 }}>Message sent!</p>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.42)' }}>Thanks for reaching out. I'll reply within a day.</p>
                  <button onClick={() => setSent(false)} style={{ marginTop:18, padding:'10px 22px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.4)', background:'none', cursor:'pointer', letterSpacing:'0.08em' }}>SEND ANOTHER</button>
                </div>
              ) : (
                <>
                  <div className="form-row">
                    <div><label className="flbl">Name</label><input className="finput" placeholder="Your name" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></div>
                    <div><label className="flbl">Email</label><input className="finput" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></div>
                  </div>
                  <label className="flbl">Message</label>
                  <textarea className="finput" rows={5} placeholder="What's on your mind?" style={{ resize:'vertical' }} value={form.msg} onChange={e => setForm(f=>({...f,msg:e.target.value}))} />
                  {formErr && <p className="form-err">Please fill in all fields.</p>}
                  <button className="fsubmit" onClick={sendMsg}>Send Message →</button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-l">YASH PATIL · © 2026</span>
          <span className="footer-l">JAVA BACKEND DEVELOPER · BUILT WITH REACT</span>
          <span className="footer-l">PUNE, INDIA</span>
        </footer>

      </main>

      <Modal name={modal} onClose={() => setModal(null)} />
    </>
  );
}