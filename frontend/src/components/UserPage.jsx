import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import LoadingSpinner from "./LoadingSpinner";

export default function UserPage({ userId, address, IpfsHash }) {
  const { theme } = useTheme();
  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const [currentNetworkId, setCurrentNetworkId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNetworkId = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const networkId = await window.ethereum.request({
            method: "net_version",
          });
          setCurrentNetworkId(networkId);
        } catch (error) {
          console.error("Error fetching network ID:", error);
        }
      } else {
        console.error("MetaMask is not installed!");
      }
      setIsLoading(false); // Stop loading after network check
    };

    getNetworkId();

    // Handle network changes without reload
    const handleChainChanged = (chainId) => {
      console.log("Network changed to:", chainId);
      setCurrentNetworkId(parseInt(chainId, 16).toString()); // Convert hex to decimal
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  // Show spinner if still loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check if network is not Ethereum Sepolia (11155111)
  if (currentNetworkId !== "11155111") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-yellow-500 text-black p-4 rounded-lg">
          ⚠ Please connect to <strong>Ethereum Sepolia</strong> network!
        </div>
      </div>
    );
  }

  // Render user details card
  return (
    <div className="flex justify-center items-center py-20">
      <Card
        shadow="lg"
        className={`min-w-[475px] ${
          theme === "dark" ? "light" : "dark"
        } bg-background text-foreground ${shadowClass} py-3`}
      >
        <CardHeader>
          <h4 className="font-bold text-large text-center">USER DETAILS</h4>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="py-2">
            <strong>ID:</strong> {userId}
          </p>
          <p className="py-2">
            <strong>Address:</strong> {address}
          </p>
          <p className="py-2">
            <strong>IPFS:</strong>{" "}
            <Link
              isExternal
              href={`https://white-top-shrimp-287.mypinata.cloud/ipfs/${IpfsHash}`}
              showAnchorIcon
            >
              View Data
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
