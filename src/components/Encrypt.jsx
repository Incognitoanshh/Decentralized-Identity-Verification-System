import React, { useState } from "react";
import { ethers } from "ethers";
import IPFSutils from "./IPFSutils";
import { encrypt } from "@metamask/eth-sig-util";
import identityABI from "../IdentityContractABI.json";

export default function Encrypt({ accountAddress, setAccountAddress, userData }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const run = async () => {
    setLoading(true); setErr("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signerAddr = await signer.getAddress();

      const contract = new ethers.Contract(import.meta.env.VITE_IDENTITY_CONTRACT, identityABI.abi, signer);

      if(!accountAddress) throw new Error("No wallet connected");

      const pubKey = await window.ethereum.request({ method:"eth_getEncryptionPublicKey", params:[signerAddr] });

      const hashCheck = ethers.utils.id(JSON.stringify(userData));
      const existing = await contract.checkHashOwner(hashCheck);
      if(existing !== "0x0000000000000000000000000000000000000000") throw new Error("This identity is already registered on-chain.");

      const encrypted = JSON.stringify(encrypt({ publicKey:pubKey, data:JSON.stringify(userData), version:"x25519-xsalsa20-poly1305" }));
      const ipfsRes = await IPFSutils(encrypted);
      if(!ipfsRes?.IpfsHash) throw new Error("IPFS upload failed");

      const tx = await contract.registerUser(ipfsRes.IpfsHash, pubKey);
      const receipt = await tx.wait();
      if(receipt.status !== 1) throw new Error("Transaction reverted on-chain");

      setDone(true);
      setAccountAddress(signerAddr);
    } catch(e) {
      console.error(e);
      setErr(e.message || "Unknown error occurred");
    } finally { setLoading(false); }
  };

  if(done) return (
    <div style={{ display:"flex", justifyContent:"center", padding:"2rem 24px" }}>
      <div style={{ background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.3)", padding:"2.5rem", maxWidth:500, textAlign:"center", width:"100%" }}>
        <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"2.5rem", color:"#00ff88", textShadow:"0 0 20px rgba(0,255,136,0.5)", marginBottom:"1rem" }}>◉</div>
        <h2 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1rem", fontWeight:800, letterSpacing:"0.1em", color:"#00ff88", marginBottom:"0.75rem" }}>IDENTITY_REGISTERED</h2>
        <p style={{ color:"rgba(180,220,255,0.5)", fontSize:"0.875rem", lineHeight:1.7, fontFamily:"'Share Tech Mono', monospace" }}>
          Your encrypted identity is now anchored on Ethereum Sepolia. Hash recorded permanently on-chain.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", justifyContent:"center", padding:"1.5rem 24px" }}>
      <div style={{ maxWidth:500, width:"100%", textAlign:"center" }}>
        {err && (
          <div style={{ marginBottom:"1rem", padding:"10px 14px", background:"rgba(255,0,110,0.05)", border:"1px solid rgba(255,0,110,0.25)", color:"#ff006e", fontFamily:"'Share Tech Mono', monospace", fontSize:11, textAlign:"left" }}>
            ERR: {err}
          </div>
        )}
        {accountAddress && (
          <>
            <button onClick={run} disabled={loading}
              style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:10, background:loading?"rgba(0,245,255,0.03)":"rgba(0,245,255,0.08)", border:`1px solid ${loading?"rgba(0,245,255,0.1)":"rgba(0,245,255,0.5)"}`, color:loading?"rgba(0,245,255,0.3)":"#00f5ff", fontFamily:"'Orbitron', monospace", fontWeight:900, fontSize:12, letterSpacing:"0.15em", padding:"16px 36px", cursor:loading?"not-allowed":"pointer", transition:"all 0.2s",
                boxShadow:loading?"none":"0 0 20px rgba(0,245,255,0.15), inset 0 0 20px rgba(0,245,255,0.04)" }}
              onMouseEnter={e=>{if(!loading){e.currentTarget.style.background="rgba(0,245,255,0.14)";e.currentTarget.style.boxShadow="0 0 28px rgba(0,245,255,0.3), inset 0 0 28px rgba(0,245,255,0.08)";}}}
              onMouseLeave={e=>{if(!loading){e.currentTarget.style.background="rgba(0,245,255,0.08)";e.currentTarget.style.boxShadow="0 0 20px rgba(0,245,255,0.15), inset 0 0 20px rgba(0,245,255,0.04)";}}}
            >
              {loading
                ? <><div style={{width:16,height:16,border:"1px solid rgba(0,245,255,0.2)",borderTop:"1px solid #00f5ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>ENCRYPTING & REGISTERING...</>
                : "◈ ENCRYPT & REGISTER IDENTITY"}
            </button>
            <p style={{ marginTop:"0.75rem", fontFamily:"'Share Tech Mono', monospace", fontSize:9, color:"rgba(0,245,255,0.2)", letterSpacing:"0.08em" }}>
              METAMASK WILL PROMPT FOR ENCRYPTION KEY APPROVAL
            </p>
          </>
        )}
      </div>
    </div>
  );
}
