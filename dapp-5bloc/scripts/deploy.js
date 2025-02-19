const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Vérifie le solde du compte pour s'assurer qu'il a assez de funds pour payer le gas
    const balance = await deployer.getBalance();
    console.log("Deployer balance:", hre.ethers.utils.formatEther(balance));

    // Déploiement du token ERC-20 (GameToken)
    const GameToken = await hre.ethers.getContractFactory("GameToken");
    const gameToken = await GameToken.deploy();
    await gameToken.deployed();
    console.log("GameToken deployed to:", gameToken.address);

    // Déploiement du NFT ERC-721 (SkinNFT)
    const SkinNFT = await hre.ethers.getContractFactory("SkinNFT");
    const skinNFT = await SkinNFT.deploy();
    await skinNFT.deployed();
    console.log("SkinNFT deployed to:", skinNFT.address);

    // Déploiement de la marketplace (Marketplace)
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(skinNFT.address, gameToken.address);
    await marketplace.deployed();
    console.log("Marketplace deployed to:", marketplace.address);

    // Si nécessaire, tu peux initialiser certains paramètres ou appeler des fonctions supplémentaires ici.

    console.log("Déploiement terminé avec succès.");
}

// Exécution du script avec gestion d'erreurs
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in deployment:", error);
        process.exit(1);
    });
