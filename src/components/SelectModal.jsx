import React from "react";
import { Link } from "react-router-dom";

const Panel = ({ to, onClick, icon, code, title, sub, desc, btnLabel, btnColor, glowColor }) => (
  <Link to={to} onClick={onClick} style={{ textDecoration:"none", flex:1, minWidth:280 }}>
    <div style={{
      background:"#020210", border:`1px solid rgba(${glowColor},0.2)`,
      padding:"2.5rem", height:"100%", position:"relative", overflow:"hidden",
      transition:"all 0.3s", cursor:"pointer", display:"flex", flexDirection:"column", gap:"1.25rem",
    }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`rgba(${glowColor},0.6)`; e.currentTarget.style.background="#050520"; e.currentTarget.style.boxShadow=`0 0 40px rgba(${glowColor},0.12), inset 0 0 40px rgba(${glowColor},0.04)`; e.currentTarget.style.transform="translateY(-4px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`rgba(${glowColor},0.2)`; e.currentTarget.style.background="#020210"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}>

      {/* Corner bracket */}
      <div style={{ position:"absolute", top:0, left:0, width:20, height:20, borderTop:`2px solid rgba(${glowColor},0.6)`, borderLeft:`2px solid rgba(${glowColor},0.6)` }} />
      <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderBottom:`2px solid rgba(${glowColor},0.6)`, borderRight:`2px solid rgba(${glowColor},0.6)` }} />

      {/* Header */}
      <div>
        <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:`rgba(${glowColor},0.5)`, letterSpacing:"0.2em", marginBottom:"1rem" }}>{code}</div>
        <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"3rem", color:`rgb(${glowColor})`, textShadow:`0 0 20px rgba(${glowColor},0.5)`, lineHeight:1, marginBottom:"0.5rem" }}>{icon}</div>
        <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.1rem", fontWeight:800, letterSpacing:"0.08em", color:"#e0f4ff", marginBottom:"0.25rem" }}>{title}</h2>
        <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:`rgba(${glowColor},0.6)`, letterSpacing:"0.15em" }}>{sub}</div>
      </div>

      {/* Divider */}
      <div style={{ height:1, background:`linear-gradient(to right, rgba(${glowColor},0.4), transparent)` }} />

      {/* Desc */}
      <p style={{ fontSize:"0.9rem", color:"rgba(180,220,255,0.5)", lineHeight:1.75, fontWeight:300, flex:1 }}>{desc}</p>

      {/* CTA */}
      <div style={{
        fontFamily:"'Orbitron', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.15em",
        color:`rgb(${glowColor})`, border:`1px solid rgba(${glowColor},0.4)`,
        padding:"12px 20px", textAlign:"center",
        background:`rgba(${glowColor},0.05)`,
        transition:"all 0.2s",
      }}>
        {btnLabel} ▶
      </div>
    </div>
  </Link>
);

export default function SelectModal({ setUser, setRequester }) {
  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ width:"100%", maxWidth:860 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"1rem" }}>// SELECT_OPERATIONAL_MODE</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"clamp(1.5rem, 4vw, 2.5rem)", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff", textShadow:"0 0 30px rgba(0,245,255,0.2)" }}>
            IDENTITY PROTOCOL
          </h1>
          <p style={{ marginTop:"0.75rem", color:"rgba(180,220,255,0.4)", fontFamily:"'Share Tech Mono', monospace", fontSize:12, letterSpacing:"0.1em" }}>
            SELECT YOUR ACCESS LEVEL TO CONTINUE
          </p>
        </div>

        {/* Cards */}
        <div style={{ display:"flex", gap:"1px", background:"rgba(0,245,255,0.06)" }}>
          <Panel
            to="/user" onClick={()=>setUser(true)}
            icon="◈" code="// MODE_01 :: IDENTITY_OWNER"
            title="IDENTITY OWNER" sub="SELF-SOVEREIGN ACCESS"
            desc="Register your Aadhaar-backed identity on-chain. Manage data sharing requests with full cryptographic control. Approve or revoke access at any time."
            btnLabel="ENTER AS IDENTITY OWNER"
            btnColor="0,245,255" glowColor="0,245,255"
          />
          <Panel
            to="/requester" onClick={()=>setRequester(true)}
            icon="⬡" code="// MODE_02 :: DATA_REQUESTER"
            title="DATA REQUESTER" sub="ENTERPRISE ACCESS"
            desc="Submit verified identity data requests to registered users. Receive cryptographically signed, user-approved data fields for KYC and compliance workflows."
            btnLabel="ENTER AS DATA REQUESTER"
            btnColor="255,0,110" glowColor="255,0,110"
          />
        </div>

        {/* Footer note */}
        <div style={{ marginTop:"1.5rem", textAlign:"center", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.2)", letterSpacing:"0.15em" }}>
          ALL SESSIONS ENCRYPTED · SEPOLIA TESTNET · W3C DID v1.0
        </div>
      </div>
    </div>
  );
}
