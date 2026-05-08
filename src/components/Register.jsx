import React, { useState } from "react";
import { ethers } from "ethers";

export default function Register({ showIdentity }) {
  const [mnemonic, setMnemonic] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [retrieved, setRetrieved] = useState("");
  const [mnInput, setMnInput] = useState("");
  const [mode, setMode] = useState(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  const create = () => {
    setErr("");
    try {
      const w = ethers.Wallet.createRandom();
      setMnemonic(w.mnemonic.phrase);
      setPrivateKey(w.privateKey);
      setMode("created");
    } catch(e) { setErr("ERR: "+e.message); }
  };

  const recover = () => {
    setErr("");
    const words = mnInput.trim().split(/\s+/);
    if(words.length !== 12) { setErr("ERR: Mnemonic must be exactly 12 words"); return; }
    try {
      const w = ethers.Wallet.fromMnemonic(mnInput.trim());
      setRetrieved(w.privateKey);
      setMode("recovered");
    } catch(e) { setErr("ERR: Invalid mnemonic — "+e.message); }
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(()=>setCopied(""), 2000); });
  };

  if(!showIdentity) return null;

  const Field = ({ label, value, copyKey, rows=1 }) => (
    <div style={{ marginBottom:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
        <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,245,255,0.4)" }}>{label}</span>
        <button onClick={()=>copy(value, copyKey)}
          style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:copied===copyKey?"#00ff88":"rgba(0,245,255,0.5)", background:"transparent", border:"none", cursor:"pointer", letterSpacing:"0.1em" }}>
          {copied===copyKey?"◉ COPIED":"◈ COPY"}
        </button>
      </div>
      {rows > 1
        ? <div style={{ background:"rgba(0,0,10,0.7)", border:"1px solid rgba(0,245,255,0.12)", padding:"12px 14px", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#e0f4ff", wordBreak:"break-all", lineHeight:1.8 }}>{value}</div>
        : <div style={{ background:"rgba(0,0,10,0.7)", border:"1px solid rgba(0,245,255,0.12)", padding:"12px 14px", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#e0f4ff", wordBreak:"break-all" }}>{value}</div>
      }
    </div>
  );

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ width:"100%", maxWidth:580 }}>
        <div style={{ marginBottom:"2rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(255,215,0,0.5)", marginBottom:"0.75rem" }}>// DID_KEY_MANAGER :: CRYPTOGRAPHIC_IDENTITY</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>KEY MANAGER</h1>
          <p style={{ marginTop:"0.5rem", color:"rgba(180,220,255,0.4)", fontSize:"0.875rem", lineHeight:1.7 }}>Generate or recover your cryptographic identity keys.</p>
        </div>

        <div style={{ background:"#020210", border:"1px solid rgba(255,215,0,0.15)", position:"relative", padding:"2rem" }}>
          {[["top","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:16, height:16, [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"2px solid rgba(255,215,0,0.5)", [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"2px solid rgba(255,215,0,0.5)" }} />
          ))}

          {/* Buttons */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"1.5rem" }}>
            <button onClick={create}
              style={{ padding:"13px", background:"rgba(255,215,0,0.06)", border:"1px solid rgba(255,215,0,0.3)", color:"#ffd700", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:10, letterSpacing:"0.12em", cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,215,0,0.12)";e.currentTarget.style.boxShadow="0 0 16px rgba(255,215,0,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,215,0,0.06)";e.currentTarget.style.boxShadow="none";}}>
              ◈ CREATE NEW
            </button>
            <button onClick={()=>setMode(mode==="recoverForm"?null:"recoverForm")}
              style={{ padding:"13px", background:"transparent", border:"1px solid rgba(0,245,255,0.2)", color:"rgba(0,245,255,0.7)", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:10, letterSpacing:"0.12em", cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,245,255,0.5)";e.currentTarget.style.background="rgba(0,245,255,0.06)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,245,255,0.2)";e.currentTarget.style.background="transparent";}}>
              ⬡ RECOVER
            </button>
          </div>

          {/* Recover Form */}
          {mode==="recoverForm" && (
            <div style={{ marginBottom:"1.5rem" }}>
              <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,245,255,0.4)", marginBottom:"0.5rem" }}>12-WORD MNEMONIC PHRASE</label>
              <textarea value={mnInput} onChange={e=>setMnInput(e.target.value)} placeholder="word1 word2 word3 ... word12" rows={3}
                style={{ width:"100%", background:"rgba(0,0,10,0.7)", border:"1px solid rgba(0,245,255,0.2)", color:"#e0f4ff", fontFamily:"'Share Tech Mono', monospace", fontSize:12, padding:"12px 14px", outline:"none", resize:"vertical" }} />
              <button onClick={recover}
                style={{ marginTop:"0.75rem", width:"100%", padding:"11px", background:"rgba(0,245,255,0.06)", border:"1px solid rgba(0,245,255,0.3)", color:"#00f5ff", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:10, letterSpacing:"0.12em", cursor:"pointer" }}>
                ▶ RECOVER PRIVATE KEY
              </button>
            </div>
          )}

          {err && (
            <div style={{ marginBottom:"1rem", padding:"10px 14px", background:"rgba(255,0,110,0.05)", border:"1px solid rgba(255,0,110,0.25)", color:"#ff006e", fontFamily:"'Share Tech Mono', monospace", fontSize:11 }}>
              {err}
            </div>
          )}

          {/* Security Warning */}
          {(mode==="created"||mode==="recovered") && (
            <div style={{ marginBottom:"1.25rem", padding:"10px 14px", background:"rgba(255,107,0,0.05)", border:"1px solid rgba(255,107,0,0.25)", color:"#ff6b00", fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.06em", lineHeight:1.6 }}>
              ⚠ SECURITY_NOTICE :: Never share private keys or mnemonics. Store offline only.
            </div>
          )}

          {/* Created */}
          {mode==="created" && mnemonic && (
            <>
              <Field label="MNEMONIC_PHRASE" value={mnemonic} copyKey="mnemonic" rows={2} />
              <Field label="PRIVATE_KEY" value={privateKey} copyKey="privkey" />
            </>
          )}

          {/* Recovered */}
          {mode==="recovered" && retrieved && (
            <Field label="RECOVERED_PRIVATE_KEY" value={retrieved} copyKey="retrieved" />
          )}
        </div>
      </div>
    </div>
  );
}
