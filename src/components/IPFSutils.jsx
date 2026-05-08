import axios from "axios";

export default async function IPFSutils(string) {
  const JWT = import.meta.env.VITE_PINATA_JWT;

  try {
    const blob = new Blob([string], { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", blob, "data.txt");

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: { Authorization: JWT },
      maxBodyLength: Infinity,
    });
    return res.data;
  } catch (e) {
    console.error("IPFS upload error:", e);
    throw new Error("IPFS upload failed: " + (e.response?.data?.error?.details || e.message));
  }
}
