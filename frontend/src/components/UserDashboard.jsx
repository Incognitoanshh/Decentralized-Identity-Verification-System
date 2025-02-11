import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestabi from "../EnhancedDataRequestContractABI.json";
import FetchIPFSData from "./FetchIPFSData";
import IPFSutils from "./IPFSutils";
import identityabi from "../IdentityContractABI.json";
import { encrypt } from "@metamask/eth-sig-util";
import LoadingSpinner from "./LoadingSpinner";
import { Card, CardFooter, CardBody, Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import ProgressBar from "./ProgressBar";

function UserDashboard(props) {
  const [userRequests, setUserRequests] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
  const identityContractAddress = import.meta.env.VITE_IDENTITY_CONTRACT;
  const identityContract = new ethers.Contract(
    identityContractAddress,
    identityabi.abi,
    signer
  );
  const dataRequestContract = new ethers.Contract(
    contractAddress,
    datarequestabi.abi,
    signer
  );
  const RequestStatus = ["Pending", "Approved", "Rejected"];
  const [isLoading, setIsLoading] = useState(false);
  const [noOfTransaction, setNoOfTransaction] = useState(0);
  const { theme } = useTheme();
  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const buttonStyle =
    theme === "dark"
      ? "bg-black text-white border-white" // White background with black text for dark theme
      : "bg-white text-black border-black"; // Black background with white text for light theme

  const [loading, setLoading] = useState({}); // Changed to an object

  useEffect(() => {
    async function fetchRequests() {
      setIsLoading(true);
      try {
        const userAddress = await signer.getAddress(); // Current user address
        console.log("🟢 User Address:", userAddress);

        // Contract se data fetch kar rahe hain
        const rawRequests = await dataRequestContract.getDetailedUserRequests(
          userAddress
        );
        console.log("🟡 Raw Requests from Contract:", rawRequests);

        if (!rawRequests || rawRequests.length === 0) {
          console.warn("⚠️ No requests found for this user.");
          setUserRequests([]); // Set empty if no data
          return;
        }

        // Format data for UI
        const formattedRequests = rawRequests.map((req) => ({
          id: req.id.toString(),
          requester: req.requester,
          fields: req.fields,
          status: ["Pending", "Approved", "Rejected"][req.status],
        }));

        console.log("🟢 Formatted Requests:", formattedRequests);
        setUserRequests(formattedRequests);
      } catch (err) {
        console.error("❌ Error fetching requests:", err);
        setUserRequests([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRequests();
  }, []); // Trigger only once on component load

  async function handleApprove(request) {
    try {
      setLoading((prev) => ({ ...prev, [request.id]: true })); // Set loading for specific request

      console.log("🔄 Starting Approval Process...");
      console.log("🔑 Fetching current user address...");
      const address = await signer.getAddress();
      console.log("🔑 Current User Address (from wallet):", address);

      console.log("📦 Fetching IPFS Hash from Identity Contract...");
      const ipfsHash = await identityContract.getUserIPFSHash();
      console.log("📦 Fetched IPFS Hash:", ipfsHash);

      console.log("📦 Fetching Encrypted Data from IPFS...");
      const encryptedData = await FetchIPFSData(ipfsHash);
      console.log("📦 Encrypted Data from IPFS:", encryptedData);

      console.log("🔓 Attempting to decrypt the data using MetaMask...");
      console.log("🔓 Attempting to decrypt the data using MetaMask...");
      try {
        const encryptedObjectString = JSON.stringify(encryptedData); // Ensure it's a string
        console.log("🔓 Encrypted Object String:", encryptedObjectString);

        const decryptedData = await window.ethereum.request({
          method: "eth_decrypt",
          params: [encryptedObjectString, address], // Pass as string
        });

        const decryptedObject = JSON.parse(decryptedData); // Parse the decrypted data
        console.log("🔓 Decrypted Data:", decryptedObject);
      } catch (err) {
        console.error(
          "❌ Error decrypting data with MetaMask:",
          err.message || err
        );
        throw new Error("Decryption failed: " + err.message || err);
      }

      console.log("🔑 Fetching Requester Details from Identity Contract...");
      const userDetails = await identityContract.getUser(request.requester);
      console.log("🔑 Requester Details:", userDetails);
      const requesterPublicKey = userDetails[3]; // Assuming public key is at index 3
      console.log("🔑 Requester Public Key:", requesterPublicKey);

      console.log("🔐 Encrypting data for the requester...");
      const encryptedForRequester = await encryptJsonObject(
        requesterPublicKey,
        decryptedObject,
        request.fields
      );
      console.log("🔐 Encrypted Data for Requester:", encryptedForRequester);

      console.log("🌐 Uploading Encrypted Data to IPFS...");
      const encryptedIpfsHash = await IPFSutils(encryptedForRequester);
      console.log("🌐 Uploaded IPFS Hash:", encryptedIpfsHash.IpfsHash);

      console.log(
        "📜 Setting the Encrypted IPFS Hash in the Identity Contract..."
      );
      const tx = await identityContract.setRequesterIpfsHash(
        encryptedIpfsHash.IpfsHash
      );
      await tx.wait();
      console.log("✅ IPFS Hash successfully set in the contract.");

      console.log(
        "📜 Approving the data request in the DataRequest Contract..."
      );
      const dataRequestTx = await dataRequestContract.approveRequest(
        request.id
      );
      await dataRequestTx.wait();
      console.log("✅ Request successfully approved!");

      // Update local state to reflect approval
      setUserRequests((prev) =>
        prev.map((req) =>
          req.id === request.id ? { ...req, status: "Approved" } : req
        )
      );

      props.notifySuccess(theme, "Request Approved");
    } catch (err) {
      console.error("❌ Error during approval process:", err.message || err);
      props.notifyDanger(theme, `Approval Failed: ${err.message || err}`);
    } finally {
      setLoading((prev) => ({ ...prev, [request.id]: false })); // Stop loading
    }
  }

  async function handleReject(requestId) {
    try {
      setLoading((prev) => ({ ...prev, [requestId]: true })); // Set loading for specific request

      const tx = await dataRequestContract.rejectRequest(requestId);
      await tx.wait();

      // Update local state
      setUserRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "Rejected" } : req
        )
      );

      props.notifySuccess(theme, "Request Rejected");
    } catch (err) {
      console.error("Error rejecting request:", err);
      props.notifyDanger(theme, "Rejection Failed");
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false })); // Stop loading
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "Pending":
        return "text-orange-500"; // Tailwind CSS class for orange text
      case "Approved":
        return "text-green-500"; // Tailwind CSS class for green text
      case "Rejected":
        return "text-red-500"; // Tailwind CSS class for red text
      default:
        return ""; // Default, no additional color
    }
  }

  async function encryptJsonObject(publicKey, jsonObject, fields) {
    console.log("Public Key:", publicKey);
    console.log("Fields to encrypt:", fields);

    // Filter out only the relevant fields from the jsonObject
    const filteredObject = {};
    fields.forEach((field) => {
      if (jsonObject.hasOwnProperty(field)) {
        filteredObject[field] = jsonObject[field];
      }
    });

    const stringifiedObject = JSON.stringify(filteredObject);
    console.log("Filtered JSON object:", stringifiedObject);

    // Create an object to pass to the encrypt function
    const encryptionParams = {
      publicKey: publicKey,
      data: stringifiedObject,
      version: "x25519-xsalsa20-poly1305",
    };

    // Encrypt the stringified JSON object using eth-sig-util
    const encryptedObject = encrypt(encryptionParams);

    return JSON.stringify(encryptedObject); // Convert the encrypted object to a string
  }

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="w-full flex flex-col items-center py-10">
            <h4 className="font-bold text-2xl ">DASHBOARD</h4>
          </div>
          <ol>
            {userRequests.map(({ id, requester, fields, status }) => (
              <div key={id} className="flex justify-center items-center pb-10">
                <Card
                  shadow="lg"
                  className={`min-w-[475px] ${
                    theme === "dark" ? "light" : "dark"
                  } bg-background text-foreground ${shadowClass}`}
                >
                  <CardBody>
                    {/* Request Details */}
                    <div className="py-4">
                      <h4 className="font-bold">
                        Requester:{" "}
                        <span className="font-normal">{requester}</span>
                      </h4>
                    </div>
                    <div className="py-4">
                      <h4 className="font-bold">
                        Fields:{" "}
                        <span className="font-normal">{fields.join(", ")}</span>
                      </h4>
                    </div>
                    <div className="py-4">
                      <h4 className="font-bold">
                        Status:{" "}
                        <span
                          className={`font-normal ${getStatusColor(status)}`}
                        >
                          {status}
                        </span>
                      </h4>
                    </div>
                  </CardBody>
                  <CardFooter>
                    {status === "Pending" && (
                      <div className="flex space-x-4">
                        <Button
                          size="md"
                          className={buttonStyle}
                          onClick={() =>
                            handleApprove({ id, requester, fields })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="md"
                          className={buttonStyle}
                          onClick={() => handleReject(id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ))}
          </ol>
        </>
      )}
    </>
  );
}

export default UserDashboard;
