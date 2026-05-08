import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function UserPage({ userId, address, IpfsHash }) {
  const [networkId, setNetworkId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      if(window.ethereum) { try { const id = await window.ethereum.request({method:"net_version"}); setNetworkId(id); } catch(e){} }
      setIsLoading(false);
    };
    get();
    const onChain = c => setNetworkId(parseInt(c,16).toString());
    if(window.ethereum) window.ethereum.on("chainChanged", onChain);
    return () => { if(window.ethereum) window.ethereum.removeListener("chainChanged", onChain); };
  }, []);

  if(isLoading) return <LoadingSpinner message="LOADING IDENTITY RECORD..." />;

  if(networkId !== "11155111") return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ background:"rgba(255,107,0,0.05)", border:"1px solid rgba(255,107,0,0.3)", padding:"2.5rem", maxWidth:500, textAlign:"center" }}>
        <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"2rem", color:"#ff6b00", marginBottom:"1rem" }}>⚠</div>
        <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1rem", fontWeight:700, letterSpacing:"0.1em", color:"#ff6b00", marginBottom:"0.75rem" }}>WRONG NETWORK DETECTED</h2>
        <p style={{ color:"rgba(180,220,255,0.5)", fontSize:"0.9rem", lineHeight:1.7 }}>
          Switch MetaMask to <strong style={{color:"#e0f4ff"}}>Ethereum Sepolia Testnet</strong> to access your identity record.
        </p>
      </div>
    </div>
  );

  const short = a => a ? `${a.slice(0,10)}...${a.slice(-8)}` : "—";

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ width:"100%", maxWidth:600 }}>
        <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"2rem" }}>// IDENTITY_RECORD :: ON_CHAIN</div>

        <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.15)", position:"relative" }}>
          {/* Corners */}
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:20, height:20, [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"2px solid #00f5ff", [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"2px solid #00f5ff" }} />
          ))}

          {/* Status bar */}
          <div style={{ padding:"12px 20px", background:"rgba(0,255,136,0.05)", borderBottom:"1px solid rgba(0,255,136,0.12)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, background:"#00ff88", boxShadow:"0 0 8px #00ff88", animation:"blink 2s ease infinite" }} />
            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
            <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#00ff88", letterSpacing:"0.15em" }}>IDENTITY_STATUS :: REGISTERED & VERIFIED</span>
          </div>

          <div style={{ padding:"2rem" }}>
            {/* Avatar row */}
            <div style={{ display:"flex", alignItems:"center", gap:"1.5rem", marginBottom:"2rem" }}>
              <div style={{ width:64, height:64, border:"1px solid rgba(0,245,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,245,255,0.05)", position:"relative" }}>
                <span style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", color:"#00f5ff", textShadow:"0 0 12px rgba(0,245,255,0.5)" }}>◈</span>
                <div style={{ position:"absolute", top:-4, right:-4, width:8, height:8, background:"#00ff88", boxShadow:"0 0 6px #00ff88" }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.1rem", fontWeight:800, letterSpacing:"0.08em", color:"#e0f4ff" }}>IDENTITY OWNER</div>
                <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.5)", letterSpacing:"0.1em", marginTop:4 }}>UID_{userId} · SEPOLIA CHAIN</div>
              </div>
            </div>

            <div style={{ height:1, background:"linear-gradient(to right, rgba(0,245,255,0.3), transparent)", marginBottom:"1.5rem" }} />

            {/* Fields */}
            {[
              { label:"USER_ID", val:`#${userId}` },
              { label:"ETH_ADDRESS", val:short(address) },
              { label:"IPFS_HASH", val:IpfsHash?`${IpfsHash.slice(0,18)}...`:"NOT SET" },
              { label:"NETWORK", val:"ETHEREUM SEPOLIA" },
              { label:"ENCRYPTION", val:"X25519-XSALSA20-POLY1305" },
            ].map(f=>(
              <div key={f.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(0,245,255,0.06)" }}>
                <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", letterSpacing:"0.12em" }}>{f.label}</span>
                <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:12, color:"#e0f4ff" }}>{f.val}</span>
              </div>
            ))}

            {/* IPFS Link */}
            {IpfsHash && (
              <a href={`https://white-top-shrimp-287.mypinata.cloud/ipfs/${IpfsHash}`} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:"1.5rem", padding:"12px", border:"1px solid rgba(0,245,255,0.2)", color:"rgba(0,245,255,0.7)", textDecoration:"none", fontFamily:"'Orbitron', monospace", fontSize:11, letterSpacing:"0.12em", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#00f5ff";e.currentTarget.style.color="#00f5ff";e.currentTarget.style.background="rgba(0,245,255,0.05)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,245,255,0.2)";e.currentTarget.style.color="rgba(0,245,255,0.7)";e.currentTarget.style.background="transparent";}}>
                ◈ VIEW ENCRYPTED PAYLOAD ON IPFS
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
