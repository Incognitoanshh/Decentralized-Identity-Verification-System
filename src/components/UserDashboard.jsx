import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestabi from "../EnhancedDataRequestContractABI.json";
import identityabi from "../IdentityContractABI.json";
import FetchIPFSData from "./FetchIPFSData";
import IPFSutils from "./IPFSutils";
import { encrypt } from "@metamask/eth-sig-util";
import LoadingSpinner from "./LoadingSpinner";

const STATUS = { Pending:["rgba(255,215,0,0.08)","#ffd700","rgba(255,215,0,0.3)"], Approved:["rgba(0,255,136,0.08)","#00ff88","rgba(0,255,136,0.3)"], Rejected:["rgba(255,0,110,0.08)","#ff006e","rgba(255,0,110,0.3)"] };

export default function UserDashboard({ notifyWarn, notifyDanger, notifySuccess }) {
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const drContract = new ethers.Contract(import.meta.env.VITE_DATA_REQUEST_CONTRACT, datarequestabi.abi, signer);
  const idContract = new ethers.Contract(import.meta.env.VITE_IDENTITY_CONTRACT, identityabi.abi, signer);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const addr = await signer.getAddress();
        const raw = await drContract.getDetailedUserRequests(addr);
        setReqs((raw||[]).map(r=>({ id:r.id.toString(), requester:r.requester, fields:r.fields, status:["Pending","Approved","Rejected"][r.status]||"Unknown" })));
      } catch(e) { console.error(e); setReqs([]); }
      setLoading(false);
    };
    fetch();
  }, []);

  const approve = async (req) => {
    setBtnLoading(p=>({...p,[req.id]:"approving"}));
    try {
      const addr = await signer.getAddress();
      const hash = await idContract.getUserIPFSHash();
      const encData = await FetchIPFSData(hash);
      const decrypted = await window.ethereum.request({ method:"eth_decrypt", params:[JSON.stringify(encData), addr] });
      const obj = JSON.parse(decrypted);
      const userDet = await idContract.getUser(req.requester);
      const pubKey = userDet[3];
      const filtered = {};
      req.fields.forEach(f=>{ if(obj[f]!==undefined) filtered[f]=obj[f]; });
      const encForReq = JSON.stringify(encrypt({ publicKey:pubKey, data:JSON.stringify(filtered), version:"x25519-xsalsa20-poly1305" }));
      const ipfsRes = await IPFSutils(encForReq);
      await (await idContract.setRequesterIpfsHash(ipfsRes.IpfsHash)).wait();
      await (await drContract.approveRequest(req.id)).wait();
      setReqs(p=>p.map(r=>r.id===req.id?{...r,status:"Approved"}:r));
      notifySuccess && notifySuccess("dark","Request Approved ✓");
    } catch(e) { notifyDanger && notifyDanger("dark","Approval failed: "+e.message); }
    setBtnLoading(p=>({...p,[req.id]:false}));
  };

  const reject = async (id) => {
    setBtnLoading(p=>({...p,[id]:"rejecting"}));
    try {
      await (await drContract.rejectRequest(id)).wait();
      setReqs(p=>p.map(r=>r.id===id?{...r,status:"Rejected"}:r));
      notifySuccess && notifySuccess("dark","Request Rejected");
    } catch(e) { notifyDanger && notifyDanger("dark","Rejection failed"); }
    setBtnLoading(p=>({...p,[id]:false}));
  };

  if(loading) return <LoadingSpinner message="LOADING REQUESTS..." />;

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", padding:"3rem 24px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom:"2.5rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// DATA_ACCESS_REQUESTS :: PENDING_REVIEW</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>DASHBOARD</h1>
          <div style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.4)" }}>
            {reqs.length} REQUEST{reqs.length!==1?"S":""} · {reqs.filter(r=>r.status==="Pending").length} PENDING
          </div>
        </div>

        {reqs.length === 0 && (
          <div style={{ textAlign:"center", padding:"4rem", background:"#020210", border:"1px solid rgba(0,245,255,0.08)" }}>
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"2.5rem", color:"rgba(0,245,255,0.2)", marginBottom:"1rem" }}>◈</div>
            <h3 style={{ fontFamily:"'Orbitron', monospace", fontSize:"0.9rem", letterSpacing:"0.1em", color:"rgba(0,245,255,0.4)" }}>NO_REQUESTS_FOUND</h3>
            <p style={{ marginTop:"0.5rem", color:"rgba(180,220,255,0.3)", fontSize:"0.8rem", fontFamily:"'Share Tech Mono', monospace" }}>Incoming requests will appear here when submitted.</p>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:"1px", background:"rgba(0,245,255,0.05)" }}>
          {reqs.map(({ id, requester, fields, status }) => {
            const [bg,color,border] = STATUS[status]||["rgba(0,245,255,0.05)","#00f5ff","rgba(0,245,255,0.2)"];
            const isLoading = btnLoading[id];
            return (
              <div key={id} style={{ background:"#020210", padding:"1.5rem", position:"relative" }}>
                {/* Left accent bar */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:color, boxShadow:`0 0 8px ${color}` }} />

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", paddingLeft:"0.75rem" }}>
                  <div>
                    <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", letterSpacing:"0.15em", marginBottom:"0.25rem" }}>REQUEST_ID :: {id}</div>
                    <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:12, color:"rgba(180,220,255,0.7)" }}>{requester.slice(0,14)}...{requester.slice(-10)}</div>
                  </div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:bg, color, border:`1px solid ${border}`, padding:"4px 12px", fontFamily:"'Orbitron', monospace", fontSize:9, fontWeight:700, letterSpacing:"0.15em" }}>
                    <span style={{ width:5, height:5, background:color, boxShadow:`0 0 4px ${color}`, display:"inline-block" }} />
                    {status.toUpperCase()}
                  </span>
                </div>

                {/* Fields */}
                <div style={{ paddingLeft:"0.75rem", marginBottom:"1rem" }}>
                  <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.3)", letterSpacing:"0.2em", marginBottom:"0.5rem" }}>REQUESTED_FIELDS</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                    {fields.map(f=>(
                      <span key={f} style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, padding:"3px 10px", border:"1px solid rgba(0,245,255,0.15)", color:"rgba(0,245,255,0.6)", letterSpacing:"0.08em" }}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {status === "Pending" && (
                  <div style={{ display:"flex", gap:"0.75rem", paddingLeft:"0.75rem" }}>
                    <button onClick={()=>approve({id,requester,fields})} disabled={!!isLoading}
                      style={{ flex:1, padding:"10px", background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.3)", color:"#00ff88", fontFamily:"'Orbitron', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.12em", cursor:isLoading?"not-allowed":"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                      onMouseEnter={e=>{if(!isLoading)e.currentTarget.style.background="rgba(0,255,136,0.12)";}}
                      onMouseLeave={e=>{if(!isLoading)e.currentTarget.style.background="rgba(0,255,136,0.06)";}}>
                      {isLoading==="approving"?<><div style={{width:12,height:12,border:"1px solid rgba(0,255,136,0.3)",borderTop:"1px solid #00ff88",borderRadius:"50%",animation:"spin 0.7s linear infinite"}} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>PROCESSING...</>:"◉ APPROVE"}
                    </button>
                    <button onClick={()=>reject(id)} disabled={!!isLoading}
                      style={{ flex:1, padding:"10px", background:"rgba(255,0,110,0.05)", border:"1px solid rgba(255,0,110,0.2)", color:"#ff006e", fontFamily:"'Orbitron', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.12em", cursor:isLoading?"not-allowed":"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e=>{if(!isLoading)e.currentTarget.style.background="rgba(255,0,110,0.1)";}}
                      onMouseLeave={e=>{if(!isLoading)e.currentTarget.style.background="rgba(255,0,110,0.05)";}}>
                      ✕ REJECT
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
