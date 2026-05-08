import { useState, useEffect } from "react";
import Register from "./components/Register";
import Encrypt from "./components/Encrypt";
import { useAddress } from "@thirdweb-dev/react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SelectModal from "./components/SelectModal";
import UserData from "./components/UserData";
import UserDashboard from "./components/UserDashboard";
import ApprovedDataPage from "./components/ApprovedDataPage";
import Navbar2 from "./components/Navbar";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import RequesterCardUI from "./components/RequesterCardUI";
import Homepage from "./components/Homepage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import { Slide } from "react-toastify";
import UserPage from "./components/UserPage";
import LoadingSpinner from "./components/LoadingSpinner";
import PDFUpload from "./components/PDFUpload";
import UNVSwap from "./components/UNVSwap";
import UNVResolver from "./components/UNVResolver";
import TransactionHistory from "./components/TransactionHistory";

// ── Toast helpers ──────────────────────────
let persistentToastId = null;

const notify    = (type, msg, theme) => {
  const opts = { position:"bottom-center", autoClose:4000, theme:theme==="dark"?"light":"dark", hideProgressBar:false };
  if(type==="info")    toast.info(msg, opts);
  if(type==="success") toast.success(msg, {...opts, autoClose:3000});
  if(type==="warn")    toast.warn(msg, opts);
  if(type==="error")   toast.error(msg, opts);
};
const notifyWarn        = (theme, msg) => notify("warn", msg, theme);
const notifySuccess     = (theme, msg) => notify("success", msg, theme);
const notifyDanger      = (theme, msg) => notify("error", msg, theme);
const notifyInfo        = (theme)      => notify("info", "Connect to Sepolia Testnet", theme);
const notifyWarnTestNet = (theme) => {
  if(persistentToastId) return;
  persistentToastId = toast.warn("⚠ Connect to Ethereum Sepolia Testnet", {
    position:"bottom-center", autoClose:false, closeOnClick:false, closeButton:false,
    theme:theme==="dark"?"light":"dark",
  });
};
const notifyTestNetSuccess = (theme) => {
  if(!persistentToastId) return;
  toast.update(persistentToastId, { render:"◉ Connected to Sepolia Testnet", type:"success", autoClose:3000, closeButton:true, theme:theme==="dark"?"light":"dark" });
  persistentToastId = null;
};

// ── Auto-navigate on wallet connect ────────
function Navigation() {
  const address = useAddress();
  const navigate = useNavigate();
  useEffect(() => {
    if(address) navigate("/menu");
    else navigate("/");
  }, [address]);
  return null;
}

function RouterHandler({ setRequester, networkId }) {
  const location = useLocation();
  const { theme } = useTheme();
  useEffect(() => {
    if(location.pathname==="/"||location.pathname==="/register") return;
    if(networkId && networkId!=="11155111") notifyWarnTestNet(theme);
    else if(networkId==="11155111") notifyTestNetSuccess(theme);
  }, [networkId, location.pathname]);
  useEffect(() => {
    if(location.pathname==="/requester") setRequester(true);
  }, [location.pathname]);
  return null;
}

// ── Main App ───────────────────────────────
function App() {
  const navigate = useNavigate();
  const [register, setRegister]           = useState(true);
  const [accountAddress, setAccountAddress] = useState("");
  const [showIdentity, setIdentity]       = useState(false);
  const [userSelect, setUserSelect]       = useState(false);
  const [requester, setRequester]         = useState(false);
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [networkId, setNetworkId]         = useState(null);
  const [isMetaMask, setIsMetaMask]       = useState(null);
  const [jsonObject, setJsonObject]       = useState(false);
  const [userData, setUserData]           = useState(null);
  const { theme } = useTheme();
  const address = useAddress();

  useEffect(() => { setIsMetaMask(typeof window.ethereum !== "undefined"); }, []);

  useEffect(() => {
    if(address !== undefined) {
      setAccountAddress(address);
      setIdentity(false);
      setRegister(false);
      setJsonObject(false);
    } else { setRegister(true); }
  }, [address]);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true); setJsonObject(false); setFetchedDetails(null);
      try {
        const details = await UserData();
        if(mounted) setFetchedDetails(details||null);
      } catch(e) {
        console.error(e);
        if(mounted) setFetchedDetails(null);
      } finally { if(mounted) setLoading(false); }
    };
    if(userSelect||requester) fetch();
    return () => { mounted = false; };
  }, [userSelect, requester, accountAddress]);

  useEffect(() => {
    if(!window.ethereum) { setIsMetaMask(false); return; }
    const onChain = c => setNetworkId(parseInt(c,16).toString());
    window.ethereum.on("chainChanged", onChain);
    window.ethereum.request({method:"net_version"}).then(setNetworkId).catch(console.error);
    return () => window.ethereum.removeListener("chainChanged", onChain);
  }, []);

  const NoMetaMask = () => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 64px)", gap:"1.5rem", textAlign:"center", padding:"2rem", background:"#00000a" }}>
      <div style={{ fontFamily:"'Orbitron', monospace", fontSize:"3rem", color:"rgba(255,107,0,0.7)", textShadow:"0 0 20px rgba(255,107,0,0.4)" }}>⚠</div>
      <div>
        <h1 style={{ fontFamily:"'Orbitron', monospace", fontSize:"1.5rem", fontWeight:900, letterSpacing:"0.08em", marginBottom:"0.75rem" }}>METAMASK_NOT_DETECTED</h1>
        <p style={{ color:"rgba(180,220,255,0.45)", maxWidth:400, lineHeight:1.8, fontFamily:"'Share Tech Mono', monospace", fontSize:12 }}>
          D.I.V.S requires MetaMask to interface with Ethereum. Install the extension to continue.
        </p>
      </div>
      <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer"
        style={{ padding:"12px 28px", background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.4)", color:"#ff6b00", fontFamily:"'Orbitron', monospace", fontWeight:700, fontSize:11, letterSpacing:"0.15em", textDecoration:"none" }}>
        ▶ INSTALL METAMASK
      </a>
    </div>
  );

  const RegFlow = () => (
    <>
      <PDFUpload accountAddress={address} setAccountAddress={setAccountAddress} jsonObject={setJsonObject} setUserData={setUserData} />
      {jsonObject && userData && (
        <Encrypt accountAddress={address} setAccountAddress={setAccountAddress} userData={userData} />
      )}
    </>
  );

  return (
    <NextUIProvider navigate={navigate}>
      <NextThemesProvider defaultTheme="dark" themes={["light","dark"]} attribute="class">
        <Navbar2 setRegister={setRegister} register={register} setIdentity={setIdentity} address={address} checkMetmask={isMetaMask} />
        <ToastContainer position="bottom-center" autoClose={4000} newestOnTop closeOnClick transition={Slide} draggable pauseOnHover
          theme={theme==="dark"?"light":"dark"}
          toastStyle={{ fontFamily:"'Share Tech Mono', monospace", fontSize:12, background:"#020210", border:"1px solid rgba(0,245,255,0.2)", color:"#e0f4ff" }} />
        <Navigation />
        <RouterHandler setRequester={setRequester} networkId={networkId} />

        <Routes>
          <Route path="/" element={
            isMetaMask===false ? <NoMetaMask /> :
            isMetaMask ? <Homepage /> :
            <LoadingSpinner message="INITIALIZING..." />
          } />

          <Route path="/register" element={<Register showIdentity={showIdentity} />} />

          <Route path="/menu" element={
            address ? <SelectModal setUser={setUserSelect} setRequester={setRequester} /> : null
          } />

          <Route path="/user" element={
            loading ? <LoadingSpinner message="CHECKING IDENTITY..." /> :
            (userSelect && fetchedDetails) ?
              <UserPage address={address} userId={fetchedDetails[0]?.toString()} IpfsHash={fetchedDetails[2]} /> :
              <RegFlow />
          } />

          <Route path="/requester" element={
            loading ? <LoadingSpinner message="CHECKING IDENTITY..." /> :
            (requester && fetchedDetails) ?
              <RequesterCardUI notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess} signerAddress={address} /> :
              <RegFlow />
          } />

          <Route path="/dashboard" element={
            <UserDashboard notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess} />
          } />

          <Route path="/approved-data" element={
            <ApprovedDataPage notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess} />
          } />

          <Route path="/unv-swap"          element={<UNVSwap notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess} />} />
          <Route path="/unv-resolver"      element={<UNVResolver />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
        </Routes>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default App;
