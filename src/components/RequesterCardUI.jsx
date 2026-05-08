import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestABI from "../EnhancedDataRequestContractABI.json";

const FIELDS = [
  { v:"aadharNumber", l:"AADHAAR NUMBER" },
  { v:"name", l:"FULL NAME" },
  { v:"gender", l:"GENDER" },
  { v:"phoneNumber", l:"PHONE NUMBER" },
  { v:"dateOfBirth", l:"DATE OF BIRTH" },
  { v:"residentAddress", l:"RESIDENT ADDRESS" },
];

export default function RequesterCardUI({ notifyWarn, notifyDanger, notifySuccess, signerAddress }) {
  const [selected, setSelected] = useState([]);
  const [target, setTarget] = useState("");
  const [addrValid, setAddrValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(import.meta.env.VITE_DATA_REQUEST_CONTRACT, datarequestABI.abi, signer);

  useEffect(()=>{
    if(!target){ setAddrValid(null); return; }
    setAddrValid(target.startsWith("0x") && target.length===42);
  },[target]);

  const toggle = v => setSelected(p=>p.includes(v)?p.filter(f=>f!==v):[...p,v]);

  const submit = async () => {
    if(!addrValid){ notifyWarn&&notifyWarn("dark","Invalid address"); return; }
    if(selected.length===0){ notifyWarn&&notifyWarn("dark","Select at least one field"); return; }
    if(signerAddress?.toLowerCase()===target.toLowerCase()){ notifyWarn&&notifyWarn("dark","Cannot request from yourself"); return; }
    setLoading(true);
    try {
      const tx = await contract.requestData(target, selected);
      await tx.wait();
      setDone(true);
      notifySuccess&&notifySuccess("dark","Request submitted ✓");
    } catch(e){ notifyDanger&&notifyDanger("dark","Failed: "+(e.reason||e.message)); }
    setLoading(false);
  };

  if(done) return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.3)", padding:"3rem", maxWidth:500, textAlign:"center" }}>
        <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"3rem", color:"#00ff88", textShadow:"0 0 20px rgba(0,255,136,0.5)", marginBottom:"1rem" }}>◉</div>
        <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1rem", fontWeight:800, letterSpacing:"0.1em", color:"#00ff88", marginBottom:"0.75rem" }}>REQUEST_SUBMITTED</h2>
        <p style={{ color:"rgba(180,220,255,0.5)", fontSize:"0.875rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
          Your data request is on-chain. Awaiting approval from the identity owner. Monitor status in the Requests tab.
        </p>
        <button onClick={()=>{setDone(false);setTarget("");setSelected([]);}} style={{ padding:"12px 28px", background:"transparent", border:"1px solid rgba(0,255,136,0.4)", color:"#00ff88", fontFamily:"'Orbitron', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.15em", cursor:"pointer" }}>
          ▶ NEW REQUEST
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ width:"100%", maxWidth:600 }}>
        <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(255,0,110,0.5)", marginBottom:"0.75rem" }}>// DATA_REQUEST_MODULE :: REQUESTER_INTERFACE</div>
        <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff", marginBottom:"0.75rem" }}>REQUEST IDENTITY DATA</h1>
        <p style={{ color:"rgba(180,220,255,0.4)", fontSize:"0.875rem", marginBottom:"2rem", lineHeight:1.7 }}>Submit a verified data request. The user must approve before any data is shared.</p>

        <div style={{ background:"#020210", border:"1px solid rgba(255,0,110,0.15)", position:"relative", padding:"2rem" }}>
          {/* Corner accents magenta */}
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:16, height:16, [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"2px solid rgba(255,0,110,0.6)", [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"2px solid rgba(255,0,110,0.6)" }} />
          ))}

          {/* Address Input */}
          <div style={{ marginBottom:"1.75rem" }}>
            <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.2em", color:"rgba(255,0,110,0.6)", marginBottom:"0.5rem" }}>TARGET_ETH_ADDRESS</label>
            <input type="text" value={target} onChange={e=>setTarget(e.target.value.trim())} placeholder="0x..."
              style={{ width:"100%", background:"rgba(0,0,10,0.8)", border:`1px solid ${addrValid===false?"rgba(255,0,110,0.6)":addrValid===true?"rgba(0,255,136,0.4)":"rgba(255,0,110,0.2)"}`, color:"#e0f4ff", fontFamily:"'Share Tech Mono', monospace", fontSize:13, padding:"12px 14px", outline:"none", transition:"border-color 0.2s" }}
              onFocus={e=>e.currentTarget.style.boxShadow="0 0 0 1px rgba(255,0,110,0.3)"}
              onBlur={e=>e.currentTarget.style.boxShadow="none"} />
            {addrValid===false && <div style={{ marginTop:"0.4rem", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"#ff006e", letterSpacing:"0.05em" }}>ERR: Invalid Ethereum address format</div>}
            {addrValid===true && <div style={{ marginTop:"0.4rem", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"#00ff88" }}>✓ ADDRESS_VALID</div>}
          </div>

          {/* Field Selection */}
          <div style={{ marginBottom:"1.75rem" }}>
            <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.2em", color:"rgba(255,0,110,0.6)", marginBottom:"0.75rem" }}>SELECT_DATA_FIELDS</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:"0.5rem" }}>
              {FIELDS.map(f=>{
                const on = selected.includes(f.v);
                return (
                  <button key={f.v} onClick={()=>toggle(f.v)} style={{ padding:"10px 12px", textAlign:"left", background:on?"rgba(255,0,110,0.08)":"rgba(0,0,10,0.5)", border:`1px solid ${on?"rgba(255,0,110,0.5)":"rgba(255,0,110,0.12)"}`, cursor:"pointer", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:on?"#ff006e":"rgba(180,220,255,0.45)", letterSpacing:"0.08em", transition:"all 0.15s", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:12, height:12, border:`1px solid ${on?"#ff006e":"rgba(255,0,110,0.3)"}`, background:on?"#ff006e":"transparent", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#020210", flexShrink:0 }}>{on?"✓":""}</span>
                    {f.l}
                  </button>
                );
              })}
            </div>
            {selected.length>0 && <div style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(255,0,110,0.5)" }}>{selected.length} FIELD{selected.length>1?"S":""} SELECTED</div>}
          </div>

          {/* Submit */}
          <button onClick={submit} disabled={loading||!addrValid||selected.length===0}
            style={{ width:"100%", padding:"14px", background:loading||!addrValid||selected.length===0?"rgba(255,0,110,0.05)":"rgba(255,0,110,0.08)", border:`1px solid ${loading||!addrValid||selected.length===0?"rgba(255,0,110,0.15)":"rgba(255,0,110,0.5)"}`, color:loading||!addrValid||selected.length===0?"rgba(255,0,110,0.3)":"#ff006e", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:11, letterSpacing:"0.15em", cursor:loading||!addrValid||selected.length===0?"not-allowed":"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:!loading&&addrValid&&selected.length>0?"0 0 16px rgba(255,0,110,0.15)":"none" }}
            onMouseEnter={e=>{if(!loading&&addrValid&&selected.length>0){e.currentTarget.style.background="rgba(255,0,110,0.14)";e.currentTarget.style.boxShadow="0 0 24px rgba(255,0,110,0.25)";}}}
            onMouseLeave={e=>{if(!loading&&addrValid&&selected.length>0){e.currentTarget.style.background="rgba(255,0,110,0.08)";e.currentTarget.style.boxShadow="0 0 16px rgba(255,0,110,0.15)";}}}>
            {loading?<><div style={{width:14,height:14,border:"1px solid rgba(255,0,110,0.3)",borderTop:"1px solid #ff006e",borderRadius:"50%",animation:"spin 0.7s linear infinite"}} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>SUBMITTING TO CHAIN...</>:"▶ SUBMIT DATA REQUEST"}
          </button>
        </div>
      </div>
    </div>
  );
}
