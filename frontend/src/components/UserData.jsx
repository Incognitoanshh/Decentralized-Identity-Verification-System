import { ethers } from "ethers";
import identityABI from "../IdentityContractABI.json";

export default async function UserData() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Request accounts
  const signer = provider.getSigner();
  const identityContract = new ethers.Contract(
    import.meta.env.VITE_IDENTITY_CONTRACT,
    identityABI.abi,
    signer
  );

  try {
    const userDetails = await identityContract.getUser(
      await signer.getAddress()
    );
    console.log("🟢 User Details:", userDetails);
    return userDetails;
  } catch (error) {
    if (error.message.includes("User not registered")) {
      console.log("⚠️ User is not registered.");
      return null;
    } else {
      console.error("❌ Unexpected error:", error.message);
      throw error;
    }
  }
}
