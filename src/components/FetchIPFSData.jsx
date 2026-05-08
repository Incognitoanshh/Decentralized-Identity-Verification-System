// BUG FIX: original used direct fetch without error handling
export default async function FetchIPFSData(ipfsHash) {
  if (!ipfsHash) throw new Error("No IPFS hash provided");
  const gateways = [
    `https://white-top-shrimp-287.mypinata.cloud/ipfs/${ipfsHash}`,
    `https://ipfs.io/ipfs/${ipfsHash}`,
    `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
  ];
  for (const url of gateways) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      return await res.json();
    } catch (e) { continue; }
  }
  throw new Error("Failed to fetch from IPFS. All gateways failed.");
}
