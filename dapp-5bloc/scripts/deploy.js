const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Vérifie le solde du compte
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", hre.ethers.formatEther(balance));

    // Déploiement du token ERC-20 (GameToken)
    const GameToken = await hre.ethers.getContractFactory("GameToken");
    const gameToken = await GameToken.deploy();
    await gameToken.waitForDeployment();
    console.log("GameToken deployed to:", await gameToken.getAddress());

    // Déploiement du NFT ERC-721 (SkinNFT)
    const SkinNFT = await hre.ethers.getContractFactory("SkinNFT");
    const skinNFT = await SkinNFT.deploy();
    await skinNFT.waitForDeployment();
    console.log("SkinNFT deployed to:", await skinNFT.getAddress());

    // Déploiement de la marketplace (Marketplace)
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(await skinNFT.getAddress(), await gameToken.getAddress());
    await marketplace.waitForDeployment();
    console.log("Marketplace deployed to:", await marketplace.getAddress());

    console.log("Déploiement terminé avec succès.");
}

// Exécution du script avec gestion d'erreurs
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in deployment:", error);
        process.exit(1);
    });
