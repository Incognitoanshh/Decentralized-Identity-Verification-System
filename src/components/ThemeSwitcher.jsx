import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;
  return (
    <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Toggle theme"
      style={{ width:32, height:32, border:"1px solid rgba(0,245,255,0.2)", background:"transparent", color:"rgba(0,245,255,0.6)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", transition:"all 0.2s" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="#00f5ff"; e.currentTarget.style.color="#00f5ff"; e.currentTarget.style.boxShadow="0 0 10px rgba(0,245,255,0.3)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,245,255,0.2)"; e.currentTarget.style.color="rgba(0,245,255,0.6)"; e.currentTarget.style.boxShadow="none";}}>
      {theme==="dark"?"☀":"☾"}
    </button>
  );
}
