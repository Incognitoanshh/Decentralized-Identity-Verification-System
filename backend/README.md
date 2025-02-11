Decentralized Identity Verification System (DIVS)
DIVS is a blockchain-based decentralized identity verification platform. It allows users to store, share, and manage sensitive identity information securely while enabling requesters to retrieve specific data fields with the user's permission.

Project Folder Structure
bash
Copy
Edit
DIVS/
├── backend/                      # Backend for smart contract interaction and IPFS integration
│   ├── artifacts/                # Compiled contract artifacts
│   ├── contracts/                # Solidity smart contracts
│   │   ├── IdentityContract.sol  # Identity management smart contract
│   │   ├── EnhancedDataRequestContract.sol # Data request management contract
│   ├── scripts/                  # Hardhat scripts for deploying contracts
│   │   └── deploy.js             # Script to deploy contracts
│   ├── uploads/                  # Temporary file storage for uploads
│   ├── server.js                 # Express.js backend server
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Backend environment variables
│   └── README.md                 # Backend documentation
├── frontend/                     # React-based frontend
│   ├── public/                   # Static assets (e.g., favicon, images)
│   ├── src/                      # Frontend source files
│   │   ├── assets/               # Image assets
│   │   ├── components/           # Reusable UI components
│   │   │   ├── UserDashboard.jsx # User dashboard to approve/reject requests
│   │   │   ├── Register.jsx      # User registration form
│   │   │   ├── FetchIPFSData.jsx # IPFS integration logic
│   │   │   ├── ...               # Additional React components
│   │   ├── App.jsx               # Main app file
│   │   ├── IdentityContractABI.json # Identity contract ABI
│   │   ├── EnhancedDataRequestContractABI.json # Data request contract ABI
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # React app entry point
│   ├── .env                      # Frontend environment variables
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── README.md                 # Frontend documentation
│   ├── vite.config.js            # Vite configuration
│   └── requirements.txt          # Dependency list for React
└── README.md                     # Main project documentation
Technologies Used
Frontend
React.js: Frontend library for building UI.
Tailwind CSS: Utility-first CSS framework.
MUI: Pre-designed React components for quick UI development.
Vite.js: Fast build tool for React.
Backend
Express.js: REST API for backend interaction.
Hardhat: Ethereum development framework for smart contracts.
IPFS: Decentralized storage for sensitive data.
ethers.js: Library to interact with Ethereum blockchain.
Blockchain
Ethereum (Polygon Mumbai): Blockchain network for smart contract interaction.
MetaMask: Wallet for blockchain transactions.
Setup Instructions
Backend
Install Dependencies: Navigate to the backend folder and run:

bash
Copy
Edit
npm install
Setup Environment Variables: Create a .env file in the backend folder with the following:

env
Copy
Edit
PRIVATE_KEY=<your-metamask-private-key>
RPC_URL=<polygon-mumbai-rpc-url>
Deploy Smart Contracts: Run the following command to deploy contracts:

bash
Copy
Edit
npx hardhat run scripts/deploy.js --network mumbai
Start Backend Server:

bash
Copy
Edit
node server.js
Frontend
Install Dependencies: Navigate to the frontend folder and run:

bash
Copy
Edit
npm install
Setup Environment Variables: Create a .env file in the frontend folder:

env
Copy
Edit
VITE_IDENTITY_CONTRACT=<deployed-identity-contract-address>
VITE_DATA_REQUEST_CONTRACT=<deployed-data-request-contract-address>
VITE_NETWORK=mumbai
VITE_IPFS_BASE_URL=https://ipfs.io/ipfs/
Start the Frontend Server:

bash
Copy
Edit
npm run dev
Access the Application: Open the application in your browser at http://localhost:5173.

How to Use
User Registration:

Connect MetaMask and register your identity by uploading Aadhaar or other sensitive data.
Data is stored on IPFS and encrypted.
Requester Data Request:

Requesters can select specific fields (e.g., Name, Gender, etc.) and send a request to the user.
User Approval/Denial:

Users can view incoming data requests, approve or reject them via their dashboard.
Data Delivery:

Approved data is securely shared via IPFS.
Environment Variables
Backend:
Located in backend/.env:

env
Copy
Edit
PRIVATE_KEY=<metamask-private-key>
RPC_URL=<polygon-mumbai-rpc-url>
Frontend:
Located in frontend/.env:

env
Copy
Edit
VITE_IDENTITY_CONTRACT=<identity-contract-address>
VITE_DATA_REQUEST_CONTRACT=<data-request-contract-address>
VITE_NETWORK=mumbai
VITE_IPFS_BASE_URL=https://ipfs.io/ipfs/
Available Scripts
Backend Scripts:
bash
Copy
Edit
# Compile smart contracts
npx hardhat compile

# Deploy smart contracts
npx hardhat run scripts/deploy.js --network mumbai

# Run backend server
node server.js
Frontend Scripts:
bash
Copy
Edit
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
Features
Decentralized identity storage with encryption.
Field-level data sharing via IPFS.
Request-based approval system.
Tailored user dashboard with dark mode.
Future Enhancements
Add support for more blockchain networks.
Enhance the file upload UI with drag-and-drop functionality.
Introduce automated KYC for requesters.
License
This project is licensed under the MIT License.