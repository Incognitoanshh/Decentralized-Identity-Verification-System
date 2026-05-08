import React from "react";

const FIELDS = [
  { value: "aadharNumber", label: "Aadhaar Number" },
  { value: "name", label: "Full Name" },
  { value: "gender", label: "Gender" },
  { value: "phoneNumber", label: "Phone" },
  { value: "dateOfBirth", label: "Date of Birth" },
  { value: "residentAddress", label: "Address" },
];

export default function RequesterCheckbox({ value: onChange }) {
  const [selected, setSelected] = React.useState([]);
  const toggle = (v) => {
    const next = selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v];
    setSelected(next);
    onChange(next);
  };
  return (
    <div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(240,238,255,0.35)", marginBottom: "0.6rem" }}>SELECT PARAMETERS</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {FIELDS.map(f => {
          const on = selected.includes(f.value);
          return (
            <button key={f.value} onClick={() => toggle(f.value)} style={{
              padding: "7px 14px", borderRadius: 8, cursor: "pointer",
              background: on ? "rgba(124,58,237,0.15)" : "rgba(11,11,19,0.5)",
              border: `1px solid ${on ? "rgba(124,58,237,0.45)" : "rgba(139,92,246,0.12)"}`,
              color: on ? "#a855f7" : "rgba(240,238,255,0.5)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              transition: "all 0.15s",
            }}>{f.label}</button>
          );
        })}
      </div>
    </div>
  );
}
