const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Starting Deployment...\n");

  // ✅ Deploy IdentityContract
  console.log("⏳ Deploying IdentityContract...");
  const IdentityContract = await hre.ethers.getContractFactory(
    "IdentityContract"
  );
  const identity = await IdentityContract.deploy();
  await identity.waitForDeployment(); // ✅ Corrected

  console.log("✅ IdentityContract deployed at:", identity.target);

  // ✅ Deploy EnhancedDataRequestContract
  console.log("\n⏳ Deploying EnhancedDataRequestContract...");
  const DataRequestContract = await hre.ethers.getContractFactory(
    "EnhancedDataRequestContract"
  );
  const dataRequest = await DataRequestContract.deploy();
  await dataRequest.waitForDeployment(); // ✅ Corrected

  console.log(
    "✅ EnhancedDataRequestContract deployed at:",
    dataRequest.target
  );

  console.log("\n🎉 All Contracts Deployed Successfully!\n");
}

// ✅ Run the deployment script & handle errors
main().catch((error) => {
  console.error("\n❌ Deployment Failed!", error);
  process.exitCode = 1;
});
