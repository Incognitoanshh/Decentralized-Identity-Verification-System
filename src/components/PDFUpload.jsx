import React, { useState, useRef } from "react";
import axios from "axios";

export default function FileUpload({ accountAddress, setAccountAddress, jsonObject, setUserData }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const LABELS = { aadharNumber:"AADHAAR NO", name:"FULL NAME", dateOfBirth:"DATE OF BIRTH", gender:"GENDER", phoneNumber:"PHONE", residentAddress:"ADDRESS" };

  const onFile = (f) => {
    if(!f) return;
    if(f.type !== "application/pdf") { setStatus("ERR_FORMAT: PDF files only"); return; }
    setFile(f); setStatus(""); setExtractedData(null);
  };

  const onUpload = () => {
    if(!file) { setStatus("ERR_NULL: No file selected"); return; }
    setUploading(true); setStatus("");
    const fd = new FormData();
    fd.append("aadhaar", file);
    axios.post("http://localhost:5000/upload-aadhaar", fd, { headers:{"Content-Type":"multipart/form-data"} })
      .then(res => {
        if(!res.data.extracted_texts?.length) throw new Error("No text extracted from PDF");
        const ex = res.data.extracted_texts[0].texts;
        const data = { aadharNumber:ex?.roi_1||"N/A", name:ex?.roi_2||"N/A", dateOfBirth:ex?.roi_3||"N/A", gender:ex?.roi_4||"N/A", phoneNumber:ex?.roi_5||"N/A", residentAddress:(ex?.roi_6||"N/A").replace(/\n/g,", ") };
        setExtractedData(data); setStatus("success"); setUserData(data); jsonObject(true);
      })
      .catch(e => setStatus("ERR: " + (e.response?.data?.error || e.message)))
      .finally(() => setUploading(false));
  };

  const SField = ({label, val}) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"10px 16px", borderBottom:"1px solid rgba(0,245,255,0.06)", gap:12 }}>
      <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.4)", letterSpacing:"0.12em", flexShrink:0 }}>{label}</span>
      <span style={{ fontFamily:"'Exo 2', sans-serif", fontSize:13, color:"#e0f4ff", textAlign:"right" }}>{val}</span>
    </div>
  );

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"#00000a", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 24px" }}>
      <div style={{ width:"100%", maxWidth:580 }}>
        {/* Header */}
        <div style={{ marginBottom:"2rem" }}>
          <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(0,245,255,0.4)", marginBottom:"0.75rem" }}>// IDENTITY_REGISTRATION :: PHASE_01</div>
          <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.8rem", fontWeight:900, letterSpacing:"0.08em", color:"#e0f4ff" }}>UPLOAD IDENTITY DOCUMENT</h1>
          <p style={{ marginTop:"0.75rem", color:"rgba(180,220,255,0.45)", fontSize:"0.875rem", lineHeight:1.7 }}>
            Upload your Aadhaar PDF from{" "}
            <a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer" style={{ color:"#00f5ff", textDecoration:"none" }}>uidai.gov.in</a>
            . Password must be removed. AI-OCR will extract identity fields.
          </p>
        </div>

        <div style={{ background:"#020210", border:"1px solid rgba(0,245,255,0.12)", position:"relative" }}>
          {/* Corner accents */}
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:16, height:16, [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"2px solid #00f5ff", [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"2px solid #00f5ff" }} />
          ))}

          <div style={{ padding:"2rem" }}>
            {/* Drop Zone */}
            <div
              style={{ border:`1px dashed ${dragOver?"#00f5ff":file?"rgba(0,255,136,0.4)":"rgba(0,245,255,0.2)"}`, padding:"3rem 2rem", textAlign:"center", cursor:"pointer", background:dragOver?"rgba(0,245,255,0.04)":file?"rgba(0,255,136,0.03)":"transparent", transition:"all 0.2s" }}
              onDragOver={e=>{e.preventDefault();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);onFile(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current?.click()}>
              <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"2rem", color:file?"#00ff88":"#00f5ff", textShadow:`0 0 16px ${file?"rgba(0,255,136,0.5)":"rgba(0,245,255,0.4)"}`, marginBottom:"0.75rem" }}>
                {file ? "◉" : "◈"}
              </div>
              <div style={{ fontFamily:"'Orbitron', monospace", fontSize:12, fontWeight:700, letterSpacing:"0.1em", color:file?"#00ff88":"rgba(0,245,255,0.8)", marginBottom:"0.4rem" }}>
                {file ? file.name : "DROP PDF HERE"}
              </div>
              <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"rgba(0,245,255,0.3)", letterSpacing:"0.1em" }}>
                {file ? `${(file.size/1024).toFixed(1)} KB · READY` : "OR CLICK TO BROWSE · PDF ONLY"}
              </div>
              <input type="file" accept="application/pdf" ref={fileRef} onChange={e=>onFile(e.target.files[0])} style={{ display:"none" }} />
            </div>

            {/* Upload btn */}
            {file && !uploading && status !== "success" && (
              <button onClick={onUpload} style={{ marginTop:"1rem", width:"100%", padding:"14px", background:"transparent", border:"1px solid #00f5ff", color:"#00f5ff", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:12, letterSpacing:"0.15em", cursor:"pointer", transition:"all 0.2s", boxShadow:"0 0 16px rgba(0,245,255,0.15), inset 0 0 16px rgba(0,245,255,0.03)" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,245,255,0.08)";e.currentTarget.style.boxShadow="0 0 24px rgba(0,245,255,0.3), inset 0 0 24px rgba(0,245,255,0.06)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.boxShadow="0 0 16px rgba(0,245,255,0.15), inset 0 0 16px rgba(0,245,255,0.03)";}}>
                ▶ EXTRACT & VERIFY IDENTITY
              </button>
            )}

            {/* Loading */}
            {uploading && (
              <div style={{ marginTop:"1rem", textAlign:"center" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <div style={{ width:16, height:16, border:"1px solid rgba(0,245,255,0.2)", borderTop:"1px solid #00f5ff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:11, color:"rgba(0,245,255,0.6)", letterSpacing:"0.1em" }}>PROCESSING PDF VIA OCR...</span>
                </div>
                <div style={{ marginTop:"0.75rem", height:1, background:"rgba(0,245,255,0.08)", overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,transparent,#00f5ff,transparent)", animation:"progbar 1.2s ease infinite" }} />
                  <style>{`@keyframes progbar{0%{transform:translateX(-150%)}100%{transform:translateX(350%)}}`}</style>
                </div>
              </div>
            )}

            {/* Error */}
            {status && status !== "success" && (
              <div style={{ marginTop:"1rem", padding:"10px 14px", background:"rgba(255,0,110,0.06)", border:"1px solid rgba(255,0,110,0.25)", color:"#ff006e", fontFamily:"'Share Tech Mono', monospace", fontSize:12, letterSpacing:"0.05em" }}>
                {status}
              </div>
            )}

            {/* Success Data */}
            {extractedData && status === "success" && (
              <div style={{ marginTop:"1.5rem" }}>
                <div style={{ padding:"8px 14px", background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.2)", color:"#00ff88", fontFamily:"'Share Tech Mono', monospace", fontSize:11, letterSpacing:"0.1em", marginBottom:"0.75rem" }}>
                  ◉ EXTRACTION_COMPLETE :: ALL_FIELDS_VERIFIED
                </div>
                <div style={{ border:"1px solid rgba(0,245,255,0.1)", background:"rgba(0,0,10,0.6)" }}>
                  {Object.entries(extractedData).map(([k,v])=><SField key={k} label={LABELS[k]||k} val={v} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
