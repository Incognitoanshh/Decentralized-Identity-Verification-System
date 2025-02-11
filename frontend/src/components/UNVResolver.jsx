"use client";
import { useState, useEffect } from "react";
import { Resolver } from "did-resolver";
import { getResolver as getEthrResolver } from "ethr-did-resolver";
import { getResolver as getWebResolver } from "web-did-resolver";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";

const INFURA_KEY = "9f57ff0ae9ca49a5a8ff817eb109eca3";

const NETWORKS = [
  {
    name: "Ethereum Mainnet",
    key: "mainnet",
    rpc: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  {
    name: "Ethereum Sepolia",
    key: "sepolia",
    rpc: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
  },
];

const UNVResolver = () => {
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [identifier, setIdentifier] = useState("");
  const [resolvedData, setResolvedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [w3cValidation, setW3cValidation] = useState(null);

  useEffect(() => {
    console.log(`✅ Selected Network: ${network.name}`);
  }, [network]);

  // Initialize Resolver with network mapping
  const provider = new ethers.providers.JsonRpcProvider(network.rpc);
  const didResolver = new Resolver({
    ...getEthrResolver({
      networks: [
        {
          name: "mainnet",
          chainId: 1,
          rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
        },
        {
          name: "sepolia",
          chainId: 11155111,
          rpcUrl: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
        },
      ],
    }),
    ...getWebResolver(),
    ...getKeyResolver(),
  });

  // Format the DID based on input
  const formatDID = () => {
    if (identifier.startsWith("did:")) return identifier; // If already formatted
    if (identifier.startsWith("0x"))
      return `did:ethr:${network.key}:${identifier}`;
    return null; // Invalid format
  };

  // Resolve the DID
  const resolveData = async () => {
    setLoading(true);
    setResolvedData(null);
    setW3cValidation(null);

    const did = formatDID();
    if (!did) {
      toast.error("⚠ Please enter a valid Ethereum address or DID!");
      setLoading(false);
      return;
    }

    console.log(`🔍 Resolving: ${did}`);

    try {
      const resolved = await didResolver.resolve(did);

      if (!resolved.didDocument) {
        console.error(`❌ No DID Document Found for ${did}`);
        setResolvedData({ error: "❌ No DID Document Found" });
        setLoading(false);
        return;
      }

      console.log(`✅ DID Resolved:`, JSON.stringify(resolved, null, 2));
      setResolvedData(resolved);
      fetchW3CValidation(resolved.didDocument);
    } catch (err) {
      console.error(`❌ Resolution Failed:`, err.message);
      setResolvedData({ error: `❌ ${err.message}` });
    }

    setLoading(false);
  };

  // W3C Validation
  const fetchW3CValidation = async (didDocument) => {
    if (!didDocument) {
      toast.error("⚠ No valid DID Document found for W3C validation!");
      return;
    }

    setW3cValidation("🔄 Checking W3C Compliance...");

    try {
      console.log(
        "🔍 Sending DID Document for W3C Validation:",
        JSON.stringify(didDocument, null, 2)
      );
      const response = await fetch(`http://localhost:5000/w3c/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(didDocument),
      });

      const result = await response.json();
      console.log("✅ W3C Validation Result:", result);

      if (result.valid) {
        setW3cValidation("✅ DID is W3C Compliant!");
        toast.success("✅ DID conforms to W3C Spec v1.0");
      } else {
        setW3cValidation("❌ DID is NOT W3C Compliant!");
        toast.error("❌ DID does NOT conform to W3C Spec.");
      }
    } catch (error) {
      console.error("❌ W3C Validation Failed:", error.message);
      setW3cValidation("❌ W3C Validation passed!");
      toast.error("❌ W3C Validation Error!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <Toaster position="top-right" />

      <div className="bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-5xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-400">
          🌐 Multi-DID Resolver
        </h2>

        {/* Network Selection */}
        <div className="mt-4">
          <label className="text-gray-300">🌎 Select Network:</label>
          <select
            className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded"
            value={network.name}
            onChange={(e) =>
              setNetwork(NETWORKS.find((n) => n.name === e.target.value))
            }
          >
            {NETWORKS.map((n) => (
              <option key={n.name}>{n.name}</option>
            ))}
          </select>
        </div>

        {/* Identifier Input */}
        <input
          type="text"
          className="w-full p-3 mt-4 rounded bg-gray-700 border border-gray-600"
          placeholder="Enter Ethereum Address or DID (e.g., 0x...)"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        {/* Resolve & Validate Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={resolveData}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
          >
            {loading ? "Resolving..." : "Resolve"}
          </button>
        </div>

        {/* Resolved Data */}
        {resolvedData && (
          <div className="mt-6 p-3 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold">✅ Resolved Data:</h3>
            <pre className="text-xs mt-2 p-3 bg-gray-800 rounded-lg overflow-x-auto">
              {JSON.stringify(resolvedData, null, 2)}
            </pre>
          </div>
        )}

        {/* W3C Validation Result */}
        {w3cValidation && (
          <div className="mt-4 p-3 bg-green-700 text-white rounded-md">
            {w3cValidation}
          </div>
        )}
      </div>
    </div>
  );
};

export default UNVResolver;
