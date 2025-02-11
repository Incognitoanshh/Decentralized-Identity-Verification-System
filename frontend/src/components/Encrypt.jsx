import React, { useState } from "react";
import { ethers } from "ethers";
import IPFSutils from "./IPFSutils";
import FetchIPFSData from "./FetchIPFSData";
import { encrypt } from "@metamask/eth-sig-util";
import identityABI from "../IdentityContractABI.json"; // ✅ Ensure correct path
import { Button } from "@nextui-org/react";
import { UserIcon } from "./UserIcon";
import { Spinner } from "@nextui-org/react";

export default function Encrypt(props) {
  let signer = null;
  let provider;
  let encryptedObjectString = null;

  let [loading, setLoading] = useState(false);
  let [transactionComplete, setTransactionComplete] = useState(false);

  const encryptData = async () => {
    setLoading(true);
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer Address:", signerAddress);

      const identity = new ethers.Contract(
        import.meta.env.VITE_IDENTITY_CONTRACT,
        identityABI.abi,
        signer
      );

      if (!props.accountAddress) {
        throw new Error("No account connected. Please connect MetaMask.");
      }

      // Request encryption public key from MetaMask
      const publicKey = await ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [signerAddress],
      });
      console.log("Public Key:", publicKey);

      // Hash the JSON object
      const hash = ethers.utils.id(JSON.stringify(props.userData));
      console.log("Hash of Object:", hash);

      // Check if hash is already registered
      const hascheck = await identity.checkHashOwner(hash);
      console.log("Hash Registered To:", hascheck);

      if (hascheck !== "0x0000000000000000000000000000000000000000") {
        throw new Error("User already registered!");
      }

      // Encrypt data
      encryptedObjectString = await encryptJsonObject(
        publicKey,
        props.userData
      );
      console.log("Encrypted Data:", encryptedObjectString);

      // Upload to IPFS
      const responseData = await IPFSutils(encryptedObjectString);

      if (!responseData || !responseData.IpfsHash) {
        throw new Error("IPFS upload failed!");
      }

      console.log("IPFS Hash:", responseData.IpfsHash);

      // Register user on blockchain
      console.log("Sending transaction...");
      const txResponse = await identity.registerUser(
        responseData.IpfsHash,
        publicKey
      );
      console.log("Transaction Sent! Hash:", txResponse.hash);

      const receipt = await txResponse.wait();
      console.log("Transaction Confirmed! Receipt:", receipt);

      if (receipt.status === 1) {
        console.log("✅ User registered successfully!");
        setTransactionComplete(true);
      } else {
        throw new Error("Transaction failed!");
      }

      setLoading(false);
      props.setAccountAddress(signerAddress);
    } catch (error) {
      console.error("❌ Error:", error.message);
      alert(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  async function encryptJsonObject(publicKey, jsonObject) {
    console.log("Encrypting Data...");
    const stringifiedObject = JSON.stringify(jsonObject);
    console.log("Stringified Data:", stringifiedObject);

    // Encrypt the JSON object
    const encryptionParams = {
      publicKey: publicKey,
      data: stringifiedObject,
      version: "x25519-xsalsa20-poly1305",
    };

    return JSON.stringify(encrypt(encryptionParams));
  }

  return (
    <div className="sweet-loading">
      {props.accountAddress && (
        <div className="flex items-center justify-center">
          <Button
            onClick={encryptData}
            color="success"
            startContent={<UserIcon />}
          >
            Register User
          </Button>
          {loading && <Spinner color="secondary" className="ml-2" />}
        </div>
      )}
    </div>
  );
}
