import React, { useState, useEffect } from "react";

const NETS = {
  sepolia:  { name:"SEPOLIA TESTNET",  api:"https://api-sepolia.etherscan.io/api",  ex:"https://sepolia.etherscan.io" },
  ethereum: { name:"ETH MAINNET",      api:"https://api.etherscan.io/api",          ex:"https://etherscan.io" },
  polygon:  { name:"POLYGON",          api:"https://api.polygonscan.com/api",        ex:"https://polygonscan.com" },
  holesky:  { name:"HOLESKY",          api:"https://api-holesky.etherscan.io/api",  ex:"https://holesky.etherscan.io" },
};

const fmtTime = ts => new Date(ts*1000).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
const fmtAddr = a => a?`${a.slice(0,8)}...${a.slice(-6)}`:"—";
const fmtHash = h => h?`${h.slice(0,10)}...${h.slice(-6)}`:"—";
const fmtEth = v => { const e=parseFloat(v)/1e18; return e===0?"0 ETH":`${e.toFixed(5)} ETH`; };
const fmtGas = p => p?`${(parseFloat(p)/1e9).toFixed(2)} Gwei`:"—";
const txType = tx => (!tx.functionName||tx.functionName==="")?"TRANSFER":tx.functionName.split("(")[0].toUpperCase();

export default function TransactionHistory() {
  const [net, setNet] = useState("sepolia");
  const [addr, setAddr] = useState("");
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(()=>{
    const af = async()=>{
      if(window.ethereum && !addr){
        try { const a=await window.ethereum.request({method:"eth_accounts"}); if(a.length>0){setAddr(a[0]);setAutoFilled(true);} } catch(e){}
      }
    };
    af();
  },[]);

  const search = async () => {
    if(!/^0x[a-fA-F0-9]{40}$/.test(addr)){ setErr("ERR: Invalid Ethereum address format (0x + 40 hex chars)"); return; }
    setLoading(true); setErr(""); setTxs([]);
    const key = import.meta.env.VITE_ETHERSCAN_API_KEY||"";
    const url = `${NETS[net].api}?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&sort=desc&apikey=${key}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if(data.status==="1") setTxs(data.result.slice(0,50));
      else if(data.message==="No transactions found") setTxs([]);
      else setErr(data.message||"No results found");
    } catch(e){ setErr("NETWORK_ERR: Cannot reach Etherscan API"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", padding:"3rem 24px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom:"2.5rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// BLOCKCHAIN_EXPLORER :: MULTI_CHAIN</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>TRANSACTION HISTORY</h1>
          <p style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.35)", letterSpacing:"0.08em" }}>Multi-chain explorer · Powered by Etherscan API</p>
        </div>

        {/* Search Panel */}
        <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.12)", padding:"1.5rem", marginBottom:"1.5rem" }}>
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"flex-end" }}>
            <div style={{ flex:"0 0 200px" }}>
              <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,245,255,0.4)", marginBottom:"0.5rem" }}>NETWORK</label>
              <select value={net} onChange={e=>setNet(e.target.value)} style={{ width:"100%", background:"rgba(0,0,10,0.8)", border:"1px solid rgba(0,245,255,0.2)", color:"#00f5ff", fontFamily:"'Share Tech Mono', monospace", fontSize:11, padding:"10px 12px", outline:"none", cursor:"pointer", letterSpacing:"0.08em" }}>
                {Object.entries(NETS).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
            <div style={{ flex:1, minWidth:260 }}>
              <label style={{ display:"block", fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,245,255,0.4)", marginBottom:"0.5rem" }}>
                WALLET / CONTRACT ADDRESS {autoFilled && <span style={{color:"rgba(0,255,136,0.6)"}}>· AUTO-FILLED</span>}
              </label>
              <input type="text" value={addr} onChange={e=>setAddr(e.target.value.trim())} placeholder="0x..." onKeyDown={e=>e.key==="Enter"&&search()}
                style={{ width:"100%", background:"rgba(0,0,10,0.8)", border:"1px solid rgba(0,245,255,0.2)", color:"#e0f4ff", fontFamily:"'Share Tech Mono', monospace", fontSize:12, padding:"10px 14px", outline:"none" }} />
            </div>
            <button onClick={search} disabled={loading}
              style={{ padding:"10px 24px", background:loading?"rgba(0,245,255,0.05)":"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.3)", color:loading?"rgba(0,245,255,0.3)":"#00f5ff", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:10, letterSpacing:"0.12em", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:8, transition:"all 0.2s" }}
              onMouseEnter={e=>{if(!loading){e.currentTarget.style.background="rgba(0,245,255,0.14)";e.currentTarget.style.boxShadow="0 0 16px rgba(0,245,255,0.2)";}}}
              onMouseLeave={e=>{if(!loading){e.currentTarget.style.background="rgba(0,245,255,0.08)";e.currentTarget.style.boxShadow="none";}}}>
              {loading?<><div style={{width:12,height:12,border:"1px solid rgba(0,245,255,0.2)",borderTop:"1px solid #00f5ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></>:"◈"} QUERY
            </button>
          </div>
        </div>

        {err && <div style={{ padding:"10px 14px", background:"rgba(255,0,110,0.05)", border:"1px solid rgba(255,0,110,0.25)", color:"#ff006e", fontFamily:"'Share Tech Mono', monospace", fontSize:11, letterSpacing:"0.05em", marginBottom:"1rem" }}>{err}</div>}

        {/* Results Table */}
        {txs.length>0 && (
          <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.1)", overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(0,245,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'Orbitron', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#00f5ff" }}>{txs.length} TRANSACTIONS</span>
              <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.35)", letterSpacing:"0.1em" }}>{NETS[net].name}</span>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"rgba(0,0,10,0.6)" }}>
                    {["TIME","TYPE","VALUE","GAS","FROM","TX HASH"].map(h=>(
                      <th key={h} style={{ padding:"8px 14px", textAlign:"left", fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:"0.15em", color:"rgba(0,245,255,0.35)", fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx,i)=>(
                    <tr key={tx.hash} style={{ borderTop:"1px solid rgba(0,245,255,0.05)", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,245,255,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"10px 14px", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", whiteSpace:"nowrap" }}>{fmtTime(tx.timeStamp)}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, padding:"2px 8px", border:"1px solid rgba(0,245,255,0.2)", color:"rgba(0,245,255,0.6)", letterSpacing:"0.08em" }}>{txType(tx)}</span>
                      </td>
                      <td style={{ padding:"10px 14px", fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"#e0f4ff", whiteSpace:"nowrap" }}>{fmtEth(tx.value)}</td>
                      <td style={{ padding:"10px 14px", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", whiteSpace:"nowrap" }}>{fmtGas(tx.gasPrice)}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <a href={`${NETS[net].ex}/address/${tx.from}`} target="_blank" rel="noopener noreferrer" style={{ color:"rgba(0,245,255,0.6)", textDecoration:"none", fontFamily:"'Share Tech Mono', monospace", fontSize:11 }}
                          onMouseEnter={e=>e.currentTarget.style.color="#00f5ff"}
                          onMouseLeave={e=>e.currentTarget.style.color="rgba(0,245,255,0.6)"}>{fmtAddr(tx.from)}</a>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <a href={`${NETS[net].ex}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" style={{ color:"rgba(255,0,110,0.6)", textDecoration:"none", fontFamily:"'Share Tech Mono', monospace", fontSize:11, display:"flex", alignItems:"center", gap:4 }}
                          onMouseEnter={e=>e.currentTarget.style.color="#ff006e"}
                          onMouseLeave={e=>e.currentTarget.style.color="rgba(255,0,110,0.6)"}>{fmtHash(tx.hash)} <span style={{fontSize:9}}>↗</span></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && txs.length===0 && !err && (
          <div style={{ textAlign:"center", padding:"4rem", background:"#020210", border:"1px solid rgba(0,245,255,0.06)" }}>
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"3rem", color:"rgba(0,245,255,0.15)", marginBottom:"1rem" }}>◈</div>
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"0.9rem", letterSpacing:"0.1em", color:"rgba(0,245,255,0.3)" }}>AWAITING_QUERY</div>
            <div style={{ marginTop:"0.5rem", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.2)", letterSpacing:"0.1em" }}>Enter an address and click QUERY to fetch transactions</div>
          </div>
        )}
      </div>
    </div>
  );
}
