# Decentralized Identity Verification System

## Introduction
The **Decentralized Identity Verification System** is a blockchain-based platform designed to ensure secure and tamper-proof identity verification. This system leverages technologies like **React.js**, **Node.js**, and **Hardhat** for blockchain integration. It eliminates the dependency on centralized authorities by using decentralized smart contracts to verify and store user identities securely.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation Guide](#installation-guide)
- [System Workflow](#system-workflow)
- [Screenshots](#screenshots)
- [Benefits](#benefits)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## Features
1. **Decentralized Identity Verification**: Uses blockchain to securely verify user identities.
2. **Tamper-proof Records**: Immutable records ensure no fraudulent changes can be made.
3. **Frontend-Backend Integration**:
   - **React.js**: For an intuitive and user-friendly interface.
   - **Node.js**: For backend services and API handling.
4. **Smart Contracts**:
   - **Hardhat**: For writing and deploying Solidity-based smart contracts.
   - Verification handled on-chain.
5. **Google Cloud Integration**: Used for secure API handling (e.g., OCR processing).

---

## Technologies Used
1. **Frontend**:
   - React.js
   - TailwindCSS
   - Vite

2. **Backend**:
   - Node.js
   - Express.js
   - Hardhat (for blockchain development)

3. **Blockchain**:
   - Solidity (Smart Contract Development)
   - Hardhat (Local Blockchain Environment)

4. **Other Tools**:
   - Google Cloud API (for Aadhaar OCR and validation)
   - Git and GitHub (Version Control)
   - dotenv (Environment Variable Management)

---

## Installation Guide

Follow these steps to set up and run the project locally:

### Prerequisites
- Node.js and npm installed.
- Hardhat installed globally.
- Google Cloud credentials.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Incognitoanshh/Decentralized-Identity-Verification-System.git
   cd Decentralized-Identity-Verification-System
   ```

2. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in both the `frontend` and `backend` directories and add the following variables:
   ```env
   # For Backend
   GOOGLE_CLOUD_KEY=<Your-Google-Cloud-API-Key>
   PRIVATE_KEY=<Your-Wallet-Private-Key>
   INFURA_URL=<Infura-Project-URL>
   
   # For Frontend
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the Application**:
   - Backend:
     ```bash
     cd backend
     node server.js
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Deploy Smart Contracts**:
   Deploy the Solidity contracts to a local or test network using Hardhat:
   ```bash
   npx hardhat run scripts/deploy.js --network rinkeby
   ```

6. **Access the Application**:
   Open the application in your browser at:
   ```
   http://localhost:3000
   ```

---

## System Workflow
1. **User Uploads Document**: User submits their Aadhaar document for verification.
2. **OCR Processing**: Google Cloud API extracts data from the document.
3. **Data Validation**: Extracted data is validated against blockchain records.
4. **Smart Contract Interaction**: The identity is verified and stored immutably on the blockchain.
5. **Response**: User receives confirmation of their verified identity.

---

## Screenshots

### 1. **Home Page**
![Home Page](Screenshots/Screenshot%202025-02-12%20001722.png)

### 2. **User Dashboard**
![User Dashboard](Screenshots/Screenshot%202025-02-12%20032719.png)

### 3. **Contract Registration**
![Contract Registration](Screenshots/Screenshot%202025-02-12%20062318.png)

### 4. **Token Swap**
![Token Swap](Screenshots/Screenshot%202025-02-11%20232735.png)

---

## Benefits
1. **Enhanced Security**: Blockchain ensures no tampering of data.
2. **Decentralization**: No reliance on a single authority for verification.
3. **Transparency**: All transactions are transparent and verifiable.
4. **Efficiency**: Automated identity verification reduces manual intervention.
5. **Cost-Effective**: Reduces operational costs compared to traditional systems.

---

## Future Enhancements
1. **Multi-Document Verification**: Support for PAN card, passport, etc.
2. **Decentralized Storage**: Use IPFS or Filecoin for storing documents securely.
3. **Global Access**: Expand support for international identity verification systems.
4. **AI-Based Fraud Detection**: Integrate AI to detect potential fraud in uploaded documents.

---

## Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## Contact
For any queries, reach out to:
- **Email**: [amritanshu1403@gmil.com](mailto:amritanshu1403@gmail.com)
- **GitHub**: [Incognitoanshh](https://github.com/Incognitoanshh)

