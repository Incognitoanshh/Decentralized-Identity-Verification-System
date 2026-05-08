import React from "react";
export default function ProgressBar() {
  return (
    <div style={{ height:2, background:"rgba(0,245,255,0.08)", overflow:"hidden" }}>
      <div style={{ height:"100%", background:"linear-gradient(90deg, transparent, #00f5ff, transparent)", backgroundSize:"40% 100%", animation:"progbar 1.2s ease infinite" }} />
      <style>{`@keyframes progbar{0%{transform:translateX(-150%)}100%{transform:translateX(350%)}}`}</style>
    </div>
  );
}
