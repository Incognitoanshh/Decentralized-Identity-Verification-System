import { ethers } from "ethers";
import identityABI from "../IdentityContractABI.json";

export default async function UserData() {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    import.meta.env.VITE_IDENTITY_CONTRACT,
    identityABI.abi,
    signer
  );
  try {
    const addr = await signer.getAddress();
    const details = await contract.getUser(addr);
    // If user ID is 0, they're not registered
    if (!details || details[0]?.toString() === "0") return null;
    return details;
  } catch (e) {
    if (e.message?.includes("User not registered") || e.message?.includes("revert")) return null;
    throw e;
  }
}
