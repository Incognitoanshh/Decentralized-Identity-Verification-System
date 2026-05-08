import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestabi from "../EnhancedDataRequestContractABI.json";
import identityabi from "../IdentityContractABI.json";
import decryptData from "./Decrypt";
import LoadingSpinner from "./LoadingSpinner";

const STATUS_CFG = {
  0:{ label:"PENDING",  bg:"rgba(255,215,0,0.06)",  color:"#ffd700", border:"rgba(255,215,0,0.3)"  },
  1:{ label:"APPROVED", bg:"rgba(0,255,136,0.06)",  color:"#00ff88", border:"rgba(0,255,136,0.3)"  },
  2:{ label:"REJECTED", bg:"rgba(255,0,110,0.06)",  color:"#ff006e", border:"rgba(255,0,110,0.3)"  },
};

const FIELD_LABELS = {
  aadharNumber:"AADHAAR NO", name:"FULL NAME", dateOfBirth:"DATE OF BIRTH",
  gender:"GENDER", phoneNumber:"PHONE", residentAddress:"ADDRESS",
};

export default function ApprovedDataPage({ notifyDanger, notifySuccess }) {
  const [reqs, setReqs] = useState([]);
  const [fetchedData, setFetchedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState({});

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const drContract = new ethers.Contract(import.meta.env.VITE_DATA_REQUEST_CONTRACT, datarequestabi.abi, signer);
  const idContract = new ethers.Contract(import.meta.env.VITE_IDENTITY_CONTRACT, identityabi.abi, signer);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const addr = await signer.getAddress();
        const ids = await drContract.getRequestsByRequester(addr);
        const list = [];
        for(const id of ids) { const r = await drContract.requests(id); list.push(r); }
        setReqs(list);
      } catch(e) { console.error(e); notifyDanger&&notifyDanger("dark","Failed to load requests"); }
      setIsLoading(false);
    };
    load();
  }, []);

  const fetchData = async (userAddr, reqId) => {
    const key = reqId.toString();
    setLoadingMap(p=>({...p,[key]:true}));
    try {
      const userRec = await idContract.users(userAddr);
      const ipfsHash = userRec[3];
      const gateways = [
        `https://white-top-shrimp-287.mypinata.cloud/ipfs/${ipfsHash}`,
        `https://ipfs.io/ipfs/${ipfsHash}`,
      ];
      let data = null;
      for(const gw of gateways) {
        try { const r = await fetch(gw,{signal:AbortSignal.timeout(8000)}); if(r.ok){data=await r.json();break;} } catch{}
      }
      if(!data) throw new Error("IPFS fetch failed on all gateways");
      const decrypted = await decryptData(JSON.stringify(data));
      setFetchedData(p=>({...p,[key]:decrypted}));
      notifySuccess&&notifySuccess("dark","Data fetched ✓");
    } catch(e) { notifyDanger&&notifyDanger("dark","Fetch failed: "+e.message); }
    setLoadingMap(p=>({...p,[key]:false}));
  };

  if(isLoading) return <LoadingSpinner message="LOADING REQUESTS..." />;

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", padding:"3rem 24px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <div style={{ marginBottom:"2.5rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// MY_REQUESTS :: REQUESTER_VIEW</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>MY REQUESTS</h1>
          <div style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.4)" }}>
            {reqs.length} TOTAL · {reqs.filter(r=>r.status===1).length} APPROVED
          </div>
        </div>

        {reqs.length===0 && (
          <div style={{ textAlign:"center", padding:"4rem", background:"#020210", border:"1px solid rgba(0,245,255,0.08)" }}>
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"3rem", color:"rgba(0,245,255,0.15)", marginBottom:"1rem" }}>⬡</div>
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"0.9rem", letterSpacing:"0.1em", color:"rgba(0,245,255,0.3)" }}>NO_REQUESTS_FOUND</div>
            <div style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.2)" }}>Submit requests via the Requester interface.</div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:"1px", background:"rgba(0,245,255,0.05)" }}>
          {reqs.map(req => {
            const id = req.id.toString();
            const cfg = STATUS_CFG[req.status] || STATUS_CFG[0];
            const fetched = fetchedData[id];
            const isLoadingThis = loadingMap[id];

            return (
              <div key={id} style={{ background:"#020210", padding:"1.5rem", position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:cfg.color, boxShadow:`0 0 8px ${cfg.color}` }} />

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem", paddingLeft:"0.75rem" }}>
                  <div>
                    <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", letterSpacing:"0.15em", marginBottom:"0.25rem" }}>REQUEST_ID :: {id}</div>
                    <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:12, color:"rgba(180,220,255,0.6)" }}>
                      {req.user?.slice(0,12)}...{req.user?.slice(-8)}
                    </div>
                  </div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, padding:"4px 12px", fontFamily:"'Orbitron', monospace", fontSize:9, fontWeight:700, letterSpacing:"0.15em" }}>
                    <span style={{ width:5, height:5, background:cfg.color, boxShadow:`0 0 4px ${cfg.color}`, display:"inline-block" }} />
                    {cfg.label}
                  </span>
                </div>

                {/* Fetch Button for Approved */}
                {req.status===1 && (
                  <div style={{ paddingLeft:"0.75rem" }}>
                    {!fetched ? (
                      <button onClick={()=>fetchData(req.user, req.id)} disabled={isLoadingThis}
                        style={{ width:"100%", padding:"11px", background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.25)", color:isLoadingThis?"rgba(0,255,136,0.3)":"#00ff88", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:10, letterSpacing:"0.12em", cursor:isLoadingThis?"not-allowed":"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                        onMouseEnter={e=>{if(!isLoadingThis){e.currentTarget.style.background="rgba(0,255,136,0.1)";e.currentTarget.style.boxShadow="0 0 12px rgba(0,255,136,0.15)";}}}
                        onMouseLeave={e=>{if(!isLoadingThis){e.currentTarget.style.background="rgba(0,255,136,0.05)";e.currentTarget.style.boxShadow="none";}}}>
                        {isLoadingThis
                          ? <><div style={{width:12,height:12,border:"1px solid rgba(0,255,136,0.2)",borderTop:"1px solid #00ff88",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>DECRYPTING...</>
                          : "◉ FETCH VERIFIED DATA"}
                      </button>
                    ) : (
                      <div style={{ border:"1px solid rgba(0,255,136,0.15)", background:"rgba(0,0,10,0.6)" }}>
                        <div style={{ padding:"8px 14px", background:"rgba(0,255,136,0.05)", borderBottom:"1px solid rgba(0,255,136,0.1)", fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"#00ff88", letterSpacing:"0.15em" }}>
                          ◉ VERIFIED_IDENTITY_DATA :: DECRYPTED
                        </div>
                        {Object.entries(fetched).map(([k,v],i,arr)=>(
                          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 14px", borderBottom:i<arr.length-1?"1px solid rgba(0,245,255,0.05)":"none", gap:12 }}>
                            <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.4)", letterSpacing:"0.1em", flexShrink:0 }}>{FIELD_LABELS[k]||k}</span>
                            <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#e0f4ff", textAlign:"right" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
