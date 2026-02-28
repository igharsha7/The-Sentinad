import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Arbiter to Monad Testnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "MON\n");

  const Arbiter = await ethers.getContractFactory("Arbiter");
  const arbiter = await Arbiter.deploy();
  await arbiter.waitForDeployment();

  const address = await arbiter.getAddress();
  console.log("✅ Arbiter deployed to:", address);
  console.log("\nAdd this to your .env:");
  console.log(`ARBITER_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
