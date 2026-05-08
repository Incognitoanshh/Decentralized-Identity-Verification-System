// BUG FIX: window.ethereum.selectedAddress is deprecated - use eth_accounts
export default async function decryptData(encryptedObjectString) {
  if (!encryptedObjectString) throw new Error("No encrypted data to decrypt.");
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) throw new Error("No wallet connected.");
    const address = accounts[0];
    const decrypted = await window.ethereum.request({
      method: "eth_decrypt",
      params: [encryptedObjectString, address],
    });
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption error:", e);
    throw new Error("Decryption failed: " + e.message);
  }
}
