import React from "react";
export default function LoadingSpinner({ message = "INITIALIZING..." }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:"2rem", background:"#00000a" }}>
      <div style={{ position:"relative", width:80, height:80 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ position:"absolute", inset:i*14, border:`1px solid ${i===0?"#00f5ff":i===1?"rgba(0,245,255,0.4)":"rgba(0,245,255,0.15)"}`, borderTopColor:"transparent", borderRadius:"50%", animation:`spin ${0.8+i*0.35}s linear infinite` }} />
        ))}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:8, height:8, background:"#00f5ff", boxShadow:"0 0 12px #00f5ff, 0 0 24px rgba(0,245,255,0.5)" }} />
      </div>
      <div>
        <div style={{ fontFamily:"'Orbitron', monospace", fontSize:11, letterSpacing:"0.3em", color:"rgba(0,245,255,0.6)", textAlign:"center" }}>{message}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:4, marginTop:"0.75rem" }}>
          {[0,1,2,3,4].map(i=>(
            <div key={i} style={{ width:4, height:4, background:"#00f5ff", animation:`blink 1.2s ${i*0.2}s ease infinite` }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:0.2}50%{opacity:1}}`}</style>
    </div>
  );
}
