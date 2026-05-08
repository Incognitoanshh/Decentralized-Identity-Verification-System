import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const TITLE = "DECENTRALIZED IDENTITY VERIFICATION";

function GlitchText({ text, style }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);
  useEffect(() => {
    let iv; let it = 0;
    const scramble = () => {
      clearInterval(iv); it = 0;
      iv = setInterval(() => {
        setDisplay(text.split("").map((c, i) => {
          if (c === " ") return " ";
          if (i < it) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(""));
        if (it >= text.length) clearInterval(iv);
        it += 0.4;
      }, 30);
    };
    const el = ref.current;
    if (el) { el.addEventListener("mouseenter", scramble); setTimeout(scramble, 600); }
    return () => { clearInterval(iv); if (el) el.removeEventListener("mouseenter", scramble); };
  }, [text]);
  return <span ref={ref} style={style}>{display}</span>;
}

const FEATURES = [
  { id: "01", icon: "◈", label: "SOVEREIGN IDENTITY", desc: "Zero central authority. Your cryptographic keys, your identity — immutable and self-controlled." },
  { id: "02", icon: "⬡", label: "BLOCKCHAIN ANCHORED", desc: "Every identity hash is permanently recorded on Ethereum Sepolia. Tamper-proof by design." },
  { id: "03", icon: "◉", label: "METAMASK ENCRYPTION", desc: "Military-grade X25519-XSalsa20-Poly1305 encryption. Only your key can decrypt your data." },
  { id: "04", icon: "◈", label: "W3C DID COMPLIANT", desc: "Fully compliant with W3C Decentralized Identifiers v1.0 specification." },
  { id: "05", icon: "⬡", label: "IPFS DISTRIBUTED", desc: "Encrypted data stored across the InterPlanetary File System — no single point of failure." },
  { id: "06", icon: "◉", label: "SELECTIVE DISCLOSURE", desc: "Approve only specific fields per requester. Your data, your terms — always." },
];

const STATS = [
  { val: "256", unit: "BIT", label: "ENCRYPTION STRENGTH" },
  { val: "W3C", unit: "v1.0", label: "DID STANDARD" },
  { val: "IPFS", unit: "P2P", label: "STORAGE LAYER" },
  { val: "0", unit: "BREACHES", label: "DATA EXPOSURE" },
];

export default function Homepage() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(iv); }, []);
  const time = new Date().toISOString().replace("T", " ").slice(0, 19);

  return (
    <div style={{ background: "#00000a", color: "#e0f4ff", minHeight: "100vh", fontFamily: "'Exo 2', sans-serif", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center", overflow: "hidden" }}>

        {/* Animated scanline */}
        <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #00f5ff, transparent)", animation: "scanline 4s linear infinite", pointerEvents: "none", zIndex: 2 }} />

        {/* Corner decorations */}
        {[["0px","0px","borderTop","borderLeft"],["0px","auto","borderTop","borderRight"],["auto","0px","borderBottom","borderLeft"],["auto","auto","borderBottom","borderRight"]].map(([t,r,b1,b2],i) => (
          <div key={i} style={{ position:"absolute", top:t!=="auto"?t:undefined, right:r!=="auto"?r:undefined, bottom:t==="auto"?"0px":undefined, left:r==="auto"?"0px":undefined, width:60, height:60, borderTop: b1==="borderTop"?"2px solid #00f5ff":undefined, borderBottom:b1==="borderBottom"?"2px solid #00f5ff":undefined, borderLeft:b2==="borderLeft"?"2px solid #00f5ff":undefined, borderRight:b2==="borderRight"?"2px solid #00f5ff":undefined, pointerEvents:"none" }} />
        ))}

        {/* Background glow orbs */}
        <div style={{ position:"absolute", top:"30%", left:"20%", width:400, height:400, background:"radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"20%", right:"15%", width:300, height:300, background:"radial-gradient(circle, rgba(255,0,110,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />

        {/* System Status */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:"2rem", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.5)", letterSpacing:"0.15em", flexWrap:"wrap", justifyContent:"center" }}>
          <span>SYS:{" "}<span style={{color:"#00ff88"}}>ONLINE</span></span>
          <span style={{color:"rgba(0,245,255,0.2)"}}>|</span>
          <span>NET:{" "}<span style={{color:"#00ff88"}}>SEPOLIA</span></span>
          <span style={{color:"rgba(0,245,255,0.2)"}}>|</span>
          <span>UTC:{" "}<span style={{color:"#00f5ff"}}>{time}</span></span>
          <span style={{color:"rgba(0,245,255,0.2)"}}>|</span>
          <span>VER:{" "}<span style={{color:"#ffd700"}}>2.0.0</span></span>
        </div>

        {/* DIVS Logo badge */}
        <div style={{ marginBottom:"1.5rem", display:"inline-flex", alignItems:"center", gap:12, background:"rgba(0,245,255,0.04)", border:"1px solid rgba(0,245,255,0.2)", borderRadius:4, padding:"8px 20px" }}>
          <div style={{ width:8, height:8, background:"#00f5ff", borderRadius:"50%", boxShadow:"0 0 8px #00f5ff, 0 0 16px rgba(0,245,255,0.5)", animation:"borderGlow 1.5s ease infinite" }} />
          <span style={{ fontFamily:"'Orbitron', monospace", fontSize:11, letterSpacing:"0.3em", color:"#00f5ff" }}>D.I.V.S PROTOCOL v2.0</span>
          <div style={{ width:8, height:8, background:"#00f5ff", borderRadius:"50%", boxShadow:"0 0 8px #00f5ff, 0 0 16px rgba(0,245,255,0.5)", animation:"borderGlow 1.5s ease infinite" }} />
        </div>

        {/* Main Title */}
        <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"clamp(1.8rem, 5vw, 4.5rem)", fontWeight:900, letterSpacing:"0.08em", lineHeight:1.05, marginBottom:"0.5rem", textShadow:"0 0 40px rgba(0,245,255,0.4)", animation:"fadeUp 0.8s ease forwards" }}>
          <GlitchText text={TITLE} style={{ background:"linear-gradient(135deg, #e0f4ff 0%, #00f5ff 50%, #e0f4ff 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }} />
        </h1>
        <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"clamp(1rem, 3vw, 2rem)", fontWeight:400, letterSpacing:"0.5em", color:"rgba(0,245,255,0.6)", marginBottom:"2rem", animation:"fadeUp 0.8s 0.15s ease forwards", opacity:0 }}>
          SYSTEM
        </h2>

        <p style={{ maxWidth:560, fontSize:"1rem", color:"rgba(180,220,255,0.65)", lineHeight:1.8, marginBottom:"2.5rem", fontWeight:300, animation:"fadeUp 0.8s 0.3s ease forwards", opacity:0 }}>
          Enterprise-grade decentralized identity infrastructure. Own your digital existence.
          Zero trust. Zero middlemen. Cryptographically enforced.
        </p>

        {/* CTA Buttons */}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", marginBottom:"4rem", animation:"fadeUp 0.8s 0.45s ease forwards", opacity:0 }}>
          <a href="#features" style={{ display:"inline-flex", alignItems:"center", gap:10, background:"transparent", border:"1px solid #00f5ff", color:"#00f5ff", fontFamily:"'Orbitron', monospace", fontSize:12, fontWeight:700, letterSpacing:"0.15em", padding:"14px 32px", textDecoration:"none", position:"relative", overflow:"hidden", transition:"all 0.3s", boxShadow:"0 0 20px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,245,255,0.05)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(0,245,255,0.1)"; e.currentTarget.style.boxShadow="0 0 30px rgba(0,245,255,0.4), inset 0 0 30px rgba(0,245,255,0.1)"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.boxShadow="0 0 20px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,245,255,0.05)"; e.currentTarget.style.transform="none"; }}>
            ▶ INITIALIZE SYSTEM
          </a>
          <a href="#howit" style={{ display:"inline-flex", alignItems:"center", gap:10, background:"transparent", border:"1px solid rgba(255,0,110,0.5)", color:"rgba(255,0,110,0.9)", fontFamily:"'Orbitron', monospace", fontSize:12, fontWeight:700, letterSpacing:"0.15em", padding:"14px 32px", textDecoration:"none", transition:"all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,0,110,0.08)"; e.currentTarget.style.boxShadow="0 0 20px rgba(255,0,110,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}>
            ◈ VIEW ARCHITECTURE
          </a>
        </div>

        {/* Stats Row */}
        <div style={{ display:"flex", gap:"3rem", flexWrap:"wrap", justifyContent:"center", animation:"fadeUp 0.8s 0.6s ease forwards", opacity:0 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, color:"#00f5ff", textShadow:"0 0 20px rgba(0,245,255,0.5)" }}>
                {s.val}<span style={{ fontSize:"0.9rem", color:"rgba(0,245,255,0.5)", marginLeft:4 }}>{s.unit}</span>
              </div>
              <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(180,220,255,0.35)", letterSpacing:"0.2em", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"6rem 24px", background:"linear-gradient(to bottom, #00000a, #020210)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// SYSTEM_CAPABILITIES</div>
            <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"clamp(1.4rem, 3vw, 2.2rem)", fontWeight:800, letterSpacing:"0.1em", color:"#e0f4ff" }}>CORE MODULES</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:"1px", background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.08)" }}>
            {FEATURES.map((f, i) => (
              <div key={f.id} style={{ background:"#020210", padding:"2rem", position:"relative", overflow:"hidden", transition:"all 0.3s", cursor:"default" }}
                onMouseEnter={e => { e.currentTarget.style.background="#050520"; e.currentTarget.querySelector(".feat-accent").style.opacity="1"; }}
                onMouseLeave={e => { e.currentTarget.style.background="#020210"; e.currentTarget.querySelector(".feat-accent").style.opacity="0"; }}>
                <div className="feat-accent" style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(0,245,255,0.04) 0%, transparent 60%)", opacity:0, transition:"opacity 0.3s", pointerEvents:"none" }} />
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"1rem" }}>
                  <span style={{ fontFamily:"'Orbitron', monospace", fontSize:28, color:"#00f5ff", textShadow:"0 0 12px rgba(0,245,255,0.5)" }}>{f.icon}</span>
                  <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", letterSpacing:"0.2em" }}>MOD_{f.id}</span>
                </div>
                <h3 style={{ fontFamily:"'Orbitron', monospace", fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.1em", color:"#e0f4ff", marginBottom:"0.75rem" }}>{f.label}</h3>
                <p style={{ fontSize:"0.875rem", color:"rgba(180,220,255,0.5)", lineHeight:1.7, fontWeight:300 }}>{f.desc}</p>
                <div style={{ position:"absolute", top:12, right:16, fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.2)" }}>{f.id}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="howit" style={{ padding:"6rem 24px", background:"#020210" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// OPERATIONAL_SEQUENCE</div>
            <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"clamp(1.4rem, 3vw, 2.2rem)", fontWeight:800, letterSpacing:"0.1em" }}>DEPLOYMENT PROTOCOL</h2>
          </div>
          <div style={{ position:"relative" }}>
            {/* Vertical line */}
            <div style={{ position:"absolute", left:32, top:0, bottom:0, width:1, background:"linear-gradient(to bottom, #00f5ff, rgba(0,245,255,0.1))" }} />
            {[
              { n:"01", t:"UPLOAD & EXTRACT", d:"Upload Aadhaar PDF. AI-powered OCR extracts and structures your identity data fields." },
              { n:"02", t:"ENCRYPT & SIGN", d:"Data encrypted via MetaMask X25519 key. Only your wallet can decrypt it — ever." },
              { n:"03", t:"DISTRIBUTE TO IPFS", d:"Encrypted payload distributed to InterPlanetary File System. Hash recorded on Ethereum." },
              { n:"04", t:"SELECTIVE DISCLOSURE", d:"Requesters submit field-specific requests. You approve or reject each one. Full control." },
            ].map((s, i) => (
              <div key={s.n} style={{ display:"flex", gap:"2rem", alignItems:"flex-start", marginBottom:"2rem", paddingLeft:80, position:"relative" }}>
                <div style={{ position:"absolute", left:16, top:8, width:32, height:32, border:"1px solid #00f5ff", display:"flex", alignItems:"center", justifyContent:"center", background:"#020210", fontFamily:"'Orbitron', monospace", fontSize:10, fontWeight:900, color:"#00f5ff", boxShadow:"0 0 12px rgba(0,245,255,0.3)" }}>{s.n}</div>
                <div style={{ background:"rgba(0,245,255,0.03)", border:"1px solid rgba(0,245,255,0.1)", padding:"1.25rem 1.5rem", flex:1, transition:"all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,245,255,0.3)"; e.currentTarget.style.background="rgba(0,245,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(0,245,255,0.1)"; e.currentTarget.style.background="rgba(0,245,255,0.03)"; }}>
                  <h3 style={{ fontFamily:"'Orbitron', monospace", fontSize:"0.8rem", fontWeight:700, letterSpacing:"0.15em", color:"#00f5ff", marginBottom:"0.5rem" }}>{s.t}</h3>
                  <p style={{ fontSize:"0.9rem", color:"rgba(180,220,255,0.5)", lineHeight:1.7, fontWeight:300 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ padding:"3rem 24px", borderTop:"1px solid rgba(0,245,255,0.08)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.25em", color:"rgba(0,245,255,0.25)", marginBottom:"1.25rem" }}>// TECH_STACK</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", justifyContent:"center" }}>
            {["ETHEREUM","IPFS","PINATA","METAMASK","SOLIDITY","REACT","HARDHAT","THIRDWEB","W3C DID","INFURA","ETHERSCAN"].map(t => (
              <span key={t} style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, padding:"5px 14px", border:"1px solid rgba(0,245,255,0.15)", color:"rgba(0,245,255,0.4)", letterSpacing:"0.1em", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,245,255,0.5)"; e.currentTarget.style.color="#00f5ff"; e.currentTarget.style.background="rgba(0,245,255,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(0,245,255,0.15)"; e.currentTarget.style.color="rgba(0,245,255,0.4)"; e.currentTarget.style.background="transparent"; }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
