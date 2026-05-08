import React, { useState, useEffect } from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Link, useLocation } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";

const NAV = [
  { to:"/menu", label:"MENU", icon:"◈" },
  { to:"/dashboard", label:"DASHBOARD", icon:"⬡" },
  { to:"/approved-data", label:"REQUESTS", icon:"◉" },
  { to:"/unv-resolver", label:"DID RESOLVER", icon:"◈" },
  { to:"/unv-swap", label:"SWAP", icon:"⬡" },
  { to:"/transaction-history", label:"TRANSACTIONS", icon:"◉" },
];

const walletTheme = {
  colors: {
    modalBg:"#020210", dropdownBg:"#020210", primaryText:"#e0f4ff",
    connectedButtonBg:"#050520", connectedButtonBgHover:"#080830",
    borderColor:"rgba(0,245,255,0.25)", primaryButtonBg:"rgba(0,245,255,0.1)",
    primaryButtonText:"#00f5ff", accentText:"#00f5ff",
    secondaryText:"rgba(180,220,255,0.6)", danger:"#ff006e", success:"#00ff88",
    secondaryButtonBg:"#080830", walletSelectorButtonHoverBg:"#080830",
  },
};

export default function Navbar2({ address, checkMetmask, setRegister, register, setIdentity }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11,19));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const shortAddr = address ? `${address.slice(0,6)}...${address.slice(-4)}` : null;

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:1000,
      background: scrolled ? "rgba(2,2,16,0.97)" : "rgba(2,2,16,0.85)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(0,245,255,0.12)",
      height:64,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 24px",
      transition:"all 0.3s",
    }}>
      {/* Left — Brand */}
      <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          width:36, height:36,
          border:"1px solid rgba(0,245,255,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative",
          boxShadow:"0 0 12px rgba(0,245,255,0.2), inset 0 0 12px rgba(0,245,255,0.05)",
        }}>
          <span style={{ fontFamily:"'Orbitron', monospace", fontSize:14, fontWeight:900, color:"#00f5ff", textShadow:"0 0 8px #00f5ff" }}>D</span>
          {/* Corner dots */}
          {[["-2px","-2px"],["auto","-2px"],["-2px","auto"],["auto","auto"]].map(([t,l],i)=>(
            <div key={i} style={{ position:"absolute", top:t!=="auto"?t:undefined, bottom:t==="auto"?"−2px":undefined, left:l!=="auto"?l:undefined, right:l==="auto"?"-2px":undefined, width:4, height:4, background:"#00f5ff", boxShadow:"0 0 4px #00f5ff" }} />
          ))}
        </div>
        <div>
          <div style={{ fontFamily:"'Orbitron', monospace", fontSize:13, fontWeight:900, color:"#e0f4ff", letterSpacing:"0.1em", lineHeight:1.1 }}>D.I.V.S</div>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.4)", letterSpacing:"0.2em" }}>PROTOCOL v2.0</div>
        </div>
      </Link>

      {/* Center — Nav Links */}
      {address && (
        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
          {NAV.map(n => {
            const active = location.pathname === n.to;
            return (
              <Link key={n.to} to={n.to} style={{
                display:"flex", alignItems:"center", gap:6,
                fontFamily:"'Orbitron', monospace", fontSize:9, fontWeight:700,
                letterSpacing:"0.12em",
                color: active ? "#00f5ff" : "rgba(180,220,255,0.45)",
                textDecoration:"none", padding:"6px 12px",
                border: active ? "1px solid rgba(0,245,255,0.3)" : "1px solid transparent",
                background: active ? "rgba(0,245,255,0.06)" : "transparent",
                transition:"all 0.2s",
              }}
                onMouseEnter={e => { if(!active){ e.currentTarget.style.color="#00f5ff"; e.currentTarget.style.borderColor="rgba(0,245,255,0.15)"; } }}
                onMouseLeave={e => { if(!active){ e.currentTarget.style.color="rgba(180,220,255,0.45)"; e.currentTarget.style.borderColor="transparent"; } }}
              >
                <span style={{ fontSize:10 }}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Right */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {/* Clock */}
        <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.35)", letterSpacing:"0.1em" }}>{time} UTC</span>

        {register && checkMetmask && (
          <Link to="/register" onClick={()=>setIdentity(true)} style={{
            fontFamily:"'Orbitron', monospace", fontSize:9, fontWeight:700, letterSpacing:"0.12em",
            color:"rgba(255,215,0,0.7)", textDecoration:"none",
            padding:"6px 12px", border:"1px solid rgba(255,215,0,0.2)",
            transition:"all 0.2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.color="#ffd700"; e.currentTarget.style.borderColor="rgba(255,215,0,0.5)"; e.currentTarget.style.background="rgba(255,215,0,0.05)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.color="rgba(255,215,0,0.7)"; e.currentTarget.style.borderColor="rgba(255,215,0,0.2)"; e.currentTarget.style.background="transparent"; }}
          >REGISTER</Link>
        )}

        {checkMetmask && (
          <ConnectWallet theme={walletTheme} btnTitle="CONNECT WALLET" modalTitle="D.I.V.S — WALLET INTERFACE"
            style={{ fontFamily:"'Orbitron', monospace", fontSize:10, letterSpacing:"0.1em" }} />
        )}
      </div>
    </nav>
  );
}
