export default async function decryptData(encryptedObjectString) {
  if (!encryptedObjectString) {
    throw new Error("No encrypted data found. Please encrypt data first.");
  }

  try {
    // Request decryption from MetaMask
    const decryptedMessage = await ethereum.request({
      method: "eth_decrypt",
      params: [encryptedObjectString, ethereum.selectedAddress],
    });

    // Parse the decrypted message
    const decryptedObject = JSON.parse(decryptedMessage);
    console.log("Decrypted Object:", decryptedObject);
    return decryptedObject;
  } catch (error) {
    console.error("❌ Decryption Error:", error.message);
    throw new Error(
      "Decryption failed. Please ensure the account matches the encryption key."
    );
  }
}
