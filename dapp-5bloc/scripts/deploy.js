const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Déploiement du token ERC-20
    const GameToken = await hre.ethers.getContractFactory("GameToken");
    const gameToken = await GameToken.deploy();
    await gameToken.deployed();
    console.log("GameToken deployed to:", gameToken.address);

    // Déploiement du NFT ERC-721
    const SkinNFT = await hre.ethers.getContractFactory("SkinNFT");
    const skinNFT = await SkinNFT.deploy();
    await skinNFT.deployed();
    console.log("SkinNFT deployed to:", skinNFT.address);

    // Déploiement de la marketplace
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(skinNFT.address, gameToken.address);
    await marketplace.deployed();
    console.log("Marketplace deployed to:", marketplace.address);
}

// Exécuter le script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
