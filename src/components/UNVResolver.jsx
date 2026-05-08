import { useState } from "react";
import { Resolver } from "did-resolver";
import { getResolver as getEthrResolver } from "ethr-did-resolver";
import { getResolver as getWebResolver } from "web-did-resolver";
import { getResolver as getKeyResolver } from "key-did-resolver";

const INFURA_KEY = import.meta.env.VITE_INFURA_KEY || "9f57ff0ae9ca49a5a8ff817eb109eca3";
const NETS = [
  { name:"ETHEREUM MAINNET", key:"mainnet", chainId:1 },
  { name:"ETHEREUM SEPOLIA", key:"sepolia", chainId:11155111 },
];

export default function UNVResolver() {
  const [net, setNet] = useState(NETS[1]);
  const [id, setId] = useState("");
  const [resolved, setResolved] = useState(null);
  const [w3c, setW3c] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const resolver = new Resolver({
    ...getEthrResolver({ networks: NETS.map(n=>({ name:n.key, chainId:n.chainId, rpcUrl:`https://${n.key}.infura.io/v3/${INFURA_KEY}` })) }),
    ...getWebResolver(), ...getKeyResolver(),
  });

  const fmtDID = () => {
    if(!id) return null;
    if(id.startsWith("did:")) return id;
    if(id.startsWith("0x") && id.length===42) return `did:ethr:${net.key}:${id}`;
    return null;
  };

  const resolve = async () => {
    setErr(""); setResolved(null); setW3c(null);
    const did = fmtDID();
    if(!did){ setErr("ERR: Enter a valid 0x address or DID string"); return; }
    setLoading(true);
    try {
      const result = await resolver.resolve(did);
      if(!result.didDocument){ setErr("ERR: No DID Document found for this identifier"); return; }
      setResolved(result);
      // W3C validation
      const doc = result.didDocument;
      const hasCtx = Array.isArray(doc["@context"])?doc["@context"].includes("https://www.w3.org/ns/did/v1"):doc["@context"]==="https://www.w3.org/ns/did/v1";
      setW3c(!!doc.id && hasCtx);
    } catch(e){ setErr("ERR: Resolution failed — "+e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", padding:"3rem 24px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div style={{ marginBottom:"2.5rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// W3C_DID_RESOLVER :: MULTI_PROTOCOL</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>DID RESOLVER</h1>
          <p style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.35)", letterSpacing:"0.08em" }}>Resolve Ethereum · Web · Key DIDs · W3C DID Spec v1.0 Compliance Check</p>
        </div>

        {/* Input Panel */}
        <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.12)", padding:"1.75rem", marginBottom:"1.5rem", position:"relative" }}>
          {[["top","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:16, height:16, [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"2px solid #00f5ff", [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"2px solid #00f5ff" }} />
          ))}
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"flex-end" }}>
            <div style={{ flex:"0 0 220px" }}>
              <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,245,255,0.4)", marginBottom:"0.5rem" }}>NETWORK</label>
              <select value={net.name} onChange={e=>setNet(NETS.find(n=>n.name===e.target.value))} style={{ width:"100%", background:"rgba(0,0,10,0.8)", border:"1px solid rgba(0,245,255,0.2)", color:"#00f5ff", fontFamily:"'Share Tech Mono', monospace", fontSize:11, padding:"10px 12px", outline:"none", cursor:"pointer" }}>
                {NETS.map(n=><option key={n.key} value={n.name}>{n.name}</option>)}
              </select>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,245,255,0.4)", marginBottom:"0.5rem" }}>ETH ADDRESS OR DID STRING</label>
              <input type="text" value={id} onChange={e=>setId(e.target.value.trim())} placeholder="0x... or did:ethr:sepolia:0x..." onKeyDown={e=>e.key==="Enter"&&resolve()}
                style={{ width:"100%", background:"rgba(0,0,10,0.8)", border:"1px solid rgba(0,245,255,0.2)", color:"#e0f4ff", fontFamily:"'Share Tech Mono', monospace", fontSize:12, padding:"10px 14px", outline:"none" }}
                onFocus={e=>e.currentTarget.style.borderColor="rgba(0,245,255,0.5)"}
                onBlur={e=>e.currentTarget.style.borderColor="rgba(0,245,255,0.2)"} />
            </div>
            <button onClick={resolve} disabled={loading||!id}
              style={{ padding:"10px 24px", background:loading||!id?"rgba(0,245,255,0.03)":"rgba(0,245,255,0.08)", border:`1px solid ${loading||!id?"rgba(0,245,255,0.1)":"rgba(0,245,255,0.35)"}`, color:loading||!id?"rgba(0,245,255,0.25)":"#00f5ff", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:10, letterSpacing:"0.12em", cursor:loading||!id?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:8 }}
              onMouseEnter={e=>{if(!loading&&id){e.currentTarget.style.background="rgba(0,245,255,0.14)";e.currentTarget.style.boxShadow="0 0 16px rgba(0,245,255,0.2)";}}}
              onMouseLeave={e=>{if(!loading&&id){e.currentTarget.style.background="rgba(0,245,255,0.08)";e.currentTarget.style.boxShadow="none";}}}>
              {loading?<><div style={{width:12,height:12,border:"1px solid rgba(0,245,255,0.2)",borderTop:"1px solid #00f5ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></>:"◈"} RESOLVE
            </button>
          </div>
        </div>

        {err && <div style={{ padding:"10px 14px", background:"rgba(255,0,110,0.05)", border:"1px solid rgba(255,0,110,0.25)", color:"#ff006e", fontFamily:"'Share Tech Mono', monospace", fontSize:11, marginBottom:"1rem" }}>{err}</div>}

        {/* W3C Badge */}
        {w3c!==null && (
          <div style={{ padding:"10px 14px", background:w3c?"rgba(0,255,136,0.05)":"rgba(255,0,110,0.05)", border:`1px solid ${w3c?"rgba(0,255,136,0.25)":"rgba(255,0,110,0.25)"}`, color:w3c?"#00ff88":"#ff006e", fontFamily:"'Share Tech Mono', monospace", fontSize:11, letterSpacing:"0.08em", marginBottom:"1rem" }}>
            {w3c?"◉ W3C_DID_SPEC_v1.0 :: COMPLIANT":"✕ W3C_DID_SPEC_v1.0 :: NON_COMPLIANT"}
          </div>
        )}

        {/* Result */}
        {resolved?.didDocument && (
          <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.12)" }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(0,245,255,0.08)", display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontFamily:"'Orbitron', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#00f5ff" }}>◉ DID_DOCUMENT_RESOLVED</span>
            </div>

            {/* Summary */}
            <div style={{ padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(0,245,255,0.06)" }}>
              {[
                ["DID", resolved.didDocument.id],
                ["CONTROLLER", Array.isArray(resolved.didDocument.controller)?resolved.didDocument.controller.join(", "):resolved.didDocument.controller||"—"],
                ["VERIFICATION_METHODS", resolved.didDocument.verificationMethod?.length||0],
                ["AUTHENTICATION", resolved.didDocument.authentication?.length||0],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"8px 0", borderBottom:"1px solid rgba(0,245,255,0.04)", gap:12 }}>
                  <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", letterSpacing:"0.1em", flexShrink:0 }}>{k}</span>
                  <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#e0f4ff", textAlign:"right", wordBreak:"break-all" }}>{String(v)}</span>
                </div>
              ))}
            </div>

            {/* Raw JSON */}
            <div style={{ padding:"1.25rem 1.5rem" }}>
              <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.3)", letterSpacing:"0.15em", marginBottom:"0.5rem" }}>RAW_DOCUMENT</div>
              <pre style={{ background:"rgba(0,0,10,0.7)", border:"1px solid rgba(0,245,255,0.07)", padding:"1rem", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.7)", overflowX:"auto", lineHeight:1.6, maxHeight:400, overflowY:"auto" }}>
                {JSON.stringify(resolved.didDocument,null,2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
