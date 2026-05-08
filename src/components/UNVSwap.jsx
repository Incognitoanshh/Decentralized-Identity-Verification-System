import { useState, useEffect } from "react";
import { ethers } from "ethers";

const TOKENS = [
  { name:"Ethereum",  symbol:"ETH",  address:ethers.constants.AddressZero, coingeckoId:"ethereum" },
  { name:"Tether",    symbol:"USDT", address:"0xdAC17F958D2ee523a2206206994597C13D831ec7", coingeckoId:"tether" },
  { name:"USD Coin",  symbol:"USDC", address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48", coingeckoId:"usd-coin" },
  { name:"Dai",       symbol:"DAI",  address:"0x6B175474E89094C44Da98b954EedeAC495271d0F", coingeckoId:"dai" },
];
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
];

export default function UNVSwap({ notifySuccess, notifyDanger, notifyWarn }) {
  const [sell, setSell] = useState(TOKENS[0]);
  const [buy, setBuy]   = useState(TOKENS[1]);
  const [amt, setAmt]   = useState("");
  const [rate, setRate] = useState(null);
  const [bal, setBal]   = useState("0");
  const [loading, setLoading] = useState(false);
  const [priceLoad, setPriceLoad] = useState(false);

  useEffect(() => { fetchRate(); fetchBal(); }, [sell, buy]);

  const fetchRate = async () => {
    setPriceLoad(true);
    try {
      const ids = [sell.coingeckoId, buy.coingeckoId].join(",");
      const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
      const d = await r.json();
      const sP = d[sell.coingeckoId]?.usd, bP = d[buy.coingeckoId]?.usd;
      setRate(sP && bP ? sP/bP : null);
    } catch { setRate(null); }
    setPriceLoad(false);
  };

  const fetchBal = async () => {
    if(!window.ethereum) return;
    try {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      const s = p.getSigner();
      const a = await s.getAddress();
      if(sell.symbol==="ETH") {
        const b = await p.getBalance(a);
        setBal(parseFloat(ethers.utils.formatEther(b)).toFixed(4));
      } else {
        const c = new ethers.Contract(sell.address, ["function balanceOf(address) view returns (uint256)"], s);
        const b = await c.balanceOf(a);
        setBal(parseFloat(ethers.utils.formatUnits(b,18)).toFixed(4));
      }
    } catch { setBal("—"); }
  };

  const doSwap = async () => {
    if(!amt || parseFloat(amt)<=0) { notifyWarn&&notifyWarn("dark","Enter a valid amount"); return; }
    if(sell.symbol===buy.symbol) { notifyWarn&&notifyWarn("dark","Select different tokens"); return; }
    setLoading(true);
    try {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      const s = p.getSigner();
      const a = await s.getAddress();
      const router = new ethers.Contract(ROUTER, ROUTER_ABI, s);
      const deadline = Math.floor(Date.now()/1000) + 1200;
      if(sell.symbol==="ETH") {
        const tx = await router.swapExactETHForTokens(0,[WETH,buy.address],a,deadline,{value:ethers.utils.parseEther(amt)});
        await tx.wait();
      } else {
        const tc = new ethers.Contract(sell.address,["function approve(address,uint256) external returns (bool)"],s);
        await (await tc.approve(ROUTER,ethers.utils.parseUnits(amt,18))).wait();
        const tx = await router.swapExactTokensForTokens(ethers.utils.parseUnits(amt,18),0,[sell.address,buy.address],a,deadline);
        await tx.wait();
      }
      notifySuccess&&notifySuccess("dark",`Swapped ${amt} ${sell.symbol} ✓`);
      fetchBal();
    } catch(e) { notifyDanger&&notifyDanger("dark","Swap failed: "+(e.reason||e.message)); }
    setLoading(false);
  };

  const insuf = parseFloat(amt||0) > parseFloat(bal||0);
  const outAmt = amt && rate ? (parseFloat(amt)*rate).toFixed(4) : "";
  const canSwap = !loading && amt && !insuf && sell.symbol!==buy.symbol;

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <div style={{ marginBottom:"2rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// TOKEN_SWAP :: UNISWAP_V3_ROUTER</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>TOKEN SWAP</h1>
        </div>

        <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.15)", position:"relative", padding:"2rem" }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:16, height:16, [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"2px solid rgba(0,245,255,0.5)", [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"2px solid rgba(0,245,255,0.5)" }} />
          ))}

          {/* Sell Box */}
          <div style={{ background:"rgba(0,0,10,0.6)", border:"1px solid rgba(0,245,255,0.1)", padding:"1.25rem", marginBottom:"0.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.6rem" }}>
              <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.4)", letterSpacing:"0.15em" }}>SELL</span>
              <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:insuf?"#ff006e":"rgba(0,245,255,0.4)", letterSpacing:"0.08em" }}>
                BAL: {bal} {sell.symbol}
              </span>
            </div>
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
              <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.0" min="0"
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:insuf?"#ff006e":"#e0f4ff", fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900 }} />
              <select value={sell.symbol} onChange={e=>setSell(TOKENS.find(t=>t.symbol===e.target.value))}
                style={{ background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.25)", color:"#00f5ff", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:11, padding:"8px 12px", cursor:"pointer", outline:"none", letterSpacing:"0.08em" }}>
                {TOKENS.map(t=><option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
          </div>

          {/* Swap Arrow */}
          <div style={{ textAlign:"center", margin:"0.35rem 0", position:"relative" }}>
            <button onClick={()=>{setSell(buy);setBuy(sell);}}
              style={{ width:32, height:32, border:"1px solid rgba(0,245,255,0.3)", background:"rgba(0,245,255,0.06)", color:"#00f5ff", cursor:"pointer", fontSize:"1rem", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", fontFamily:"'Orbitron', monospace" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,245,255,0.15)";e.currentTarget.style.boxShadow="0 0 12px rgba(0,245,255,0.3)";e.currentTarget.style.transform="rotate(180deg)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,245,255,0.06)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              ⇅
            </button>
          </div>

          {/* Buy Box */}
          <div style={{ background:"rgba(0,0,10,0.6)", border:"1px solid rgba(0,245,255,0.1)", padding:"1.25rem", marginBottom:"1.25rem" }}>
            <div style={{ marginBottom:"0.6rem" }}>
              <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.4)", letterSpacing:"0.15em" }}>BUY</span>
            </div>
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
              <div style={{ flex:1, fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, color:outAmt?"#00ff88":"rgba(0,245,255,0.2)" }}>
                {priceLoad ? "···" : outAmt || "0.0"}
              </div>
              <select value={buy.symbol} onChange={e=>setBuy(TOKENS.find(t=>t.symbol===e.target.value))}
                style={{ background:"rgba(0,255,136,0.08)", border:"1px solid rgba(0,255,136,0.25)", color:"#00ff88", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:11, padding:"8px 12px", cursor:"pointer", outline:"none", letterSpacing:"0.08em" }}>
                {TOKENS.map(t=><option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
          </div>

          {/* Rate */}
          {rate && !priceLoad && (
            <div style={{ marginBottom:"1rem", textAlign:"center", fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.35)", letterSpacing:"0.08em" }}>
              RATE :: 1 {sell.symbol} ≈ {rate.toFixed(4)} {buy.symbol}
            </div>
          )}

          {/* Swap Button */}
          <button onClick={doSwap} disabled={!canSwap}
            style={{ width:"100%", padding:"15px", background:insuf?"rgba(255,0,110,0.06)":canSwap?"rgba(0,245,255,0.08)":"rgba(0,245,255,0.03)", border:`1px solid ${insuf?"rgba(255,0,110,0.4)":canSwap?"rgba(0,245,255,0.5)":"rgba(0,245,255,0.1)"}`, color:insuf?"#ff006e":canSwap?"#00f5ff":"rgba(0,245,255,0.25)", fontFamily:"'Orbitron', monospace", fontWeight:900, fontSize:12, letterSpacing:"0.15em", cursor:canSwap?"pointer":"not-allowed", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow: canSwap&&!insuf?"0 0 16px rgba(0,245,255,0.12)":"none" }}
            onMouseEnter={e=>{if(canSwap&&!insuf){e.currentTarget.style.background="rgba(0,245,255,0.14)";e.currentTarget.style.boxShadow="0 0 24px rgba(0,245,255,0.25)";}}}
            onMouseLeave={e=>{if(canSwap&&!insuf){e.currentTarget.style.background="rgba(0,245,255,0.08)";e.currentTarget.style.boxShadow="0 0 16px rgba(0,245,255,0.12)";}}}
          >
            {loading?<><div style={{width:14,height:14,border:"1px solid rgba(0,245,255,0.2)",borderTop:"1px solid #00f5ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>EXECUTING SWAP...</>
             :insuf?"INSUFFICIENT_BALANCE"
             :sell.symbol===buy.symbol?"SELECT_DIFFERENT_TOKENS"
             :"▶ EXECUTE SWAP"}
          </button>

          <div style={{ marginTop:"0.75rem", textAlign:"center", fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.2)", letterSpacing:"0.08em" }}>
            PRICES VIA COINGECKO · ROUTER: UNISWAP V3 MAINNET
          </div>
        </div>
      </div>
    </div>
  );
}
