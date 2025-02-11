require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS
app.use(cors());

// ✅ Multer Setup (File Upload Handling)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Pinata API Keys (Set these in `.env` file)
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// ✅ Aadhaar PDF Upload Route
app.post("/upload-aadhaar", upload.single("aadhaar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📂 File received:", req.file.originalname);

    // ✅ Upload to Pinata
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
    });

    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    const ipfsHash = pinataResponse.data.IpfsHash;
    console.log("✅ Uploaded to Pinata:", ipfsHash);

    // ✅ Simulating Aadhaar OCR Extraction (Replace this with actual OCR API if needed)
    const extractedData = {
      extracted_texts: [
        {
          texts: {
            roi_1: "5322 1821 1070", // Aadhaar Number
            roi_2: "Amritanshu", // Name
            roi_3: "14/03/2004", // DOB
            roi_4: "Male", // Gender
            roi_5: "6201533303", // Phone Number
            roi_6: "XYZ Street, ABC City, India", // Address
          },
        },
      ],
    };

    res.json({
      message: "File uploaded successfully!",
      ipfsHash,
      extracted_texts: extractedData.extracted_texts,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
