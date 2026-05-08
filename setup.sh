#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   D.I.V.S - Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Create .env file
echo ""
echo "[1/3] Creating .env file..."

cat > .env << 'ENVEOF'
# THIRDWEB
VITE_REACT_APP_CLIENT_ID=76856362b4bb3db3decef11336314241

# SMART CONTRACTS (fill after deploying)
VITE_IDENTITY_CONTRACT=0xYourIdentityContractAddress
VITE_DATA_REQUEST_CONTRACT=0xYourDataRequestContractAddress

# PINATA
VITE_PINATA_API_KEY=6c605f4e20a3bda09378
VITE_PINATA_SECRET_KEY=7321d74dd5e6653ef1e33425135e6cf99e89e753c0cb82c016662e98ced90156
VITE_PINATA_JWT=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Njc1YmZlZC0wN2E4LTRiZWQtYWNkNC1hNTljMGQ1MDlkYjkiLCJlbWFpbCI6ImFtcml0YW5zaHUxNDAzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2YzYwNWY0ZTIwYTNiZGEwOTM3OCIsInNjb3BlZEtleVNlY3JldCI6IjczMjFkNzRkZDVlNjY1M2VmMWUzMzQyNTEzNWU2Y2Y5OWU4OWU3NTNjMGNiODJjMDE2NjYyZTk4Y2VkOTAxNTYiLCJleHAiOjE4MDk1MTYxMTR9.z-cy8hKQDSR4LwWYRZFr59aLuSKgJKQsNdYVY_t59tk

# ETHERSCAN
VITE_ETHERSCAN_API_KEY=G8SSRGC13ZEZJ6PJHR2SWUR1K2PVXKC81H

# INFURA
VITE_INFURA_KEY=9f57ff0ae9ca49a5a8ff817eb109eca3
ENVEOF

echo "✅ .env created"

# Step 2: Install dependencies
echo ""
echo "[2/3] Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Step 3: Done
echo ""
echo "[3/3] Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⚠️  Abhi bhi 2 cheezein baaki hain:"
echo ""
echo "  1. Contracts deploy karo:"
echo "     cd ../backend"
echo "     npm install"
echo "     npx hardhat run scripts/deploy.js --network sepolia"
echo ""
echo "  2. Deploy output se addresses copy karo"
echo "     aur .env mein update karo:"
echo "     VITE_IDENTITY_CONTRACT=0x..."
echo "     VITE_DATA_REQUEST_CONTRACT=0x..."
echo ""
echo "  Phir frontend start karo:"
echo "     cd ../frontend  (ya is folder mein raho)"
echo "     npm run dev"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
