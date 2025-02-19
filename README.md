Marketplace de Skins League of Legends
Description

Ce projet est une Marketplace décentralisée permettant l'achat, la vente et l'échange de skins de personnages de League of Legends sous forme de NFTs. Le projet inclut :

    GameToken : un token ERC-20 utilisé comme monnaie sur la marketplace.
    SkinNFT : un token ERC-721 pour les skins de personnages.
    Marketplace : un contrat permettant aux utilisateurs de lister et acheter des skins à l'aide du GameToken.

Prérequis

Pour exécuter ce projet, tu auras besoin de :

    Node.js (version 16.x ou supérieure)
    Hardhat pour le déploiement des contrats intelligents
    Metamask ou un autre portefeuille Ethereum pour interagir avec le frontend
    Un compte Ethereum avec des fonds pour payer les frais de gas (sur un testnet ou mainnet)

Installation
1. Cloner le projet

Clone le projet depuis GitHub en utilisant la commande suivante :
```Bash
git clone https://github.com/ton-utilisateur/marketplace-skins.git
cd marketplace-skins
```

2. Installer les dépendances

Installe les dépendances nécessaires avec npm :
```Bash
npm install
```

3. Configurer l'environnement

Crée un fichier .env à la racine de ton projet et ajoute tes clés API et informations de connexion. Par exemple :

```
ETHERSCAN_API_KEY="ton-etherscan-api-key"
INFURA_API_KEY="ton-infura-api-key"
PRIVATE_KEY="ta-clé-privée-pour-le-deploiement"
```

4. Configurer Hardhat

Dans le fichier `hardhat.config.js`, assure-toi que les réseaux sont correctement configurés pour ton environnement (testnet/mainnet). Voici un exemple de configuration pour un testnet :
```
module.exports = {
  solidity: "0.8.18",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
```

5. Déployer les contrats

Utilise Hardhat pour déployer les contrats sur un réseau Ethereum (testnet ou mainnet). Pour cela, exécute le script de déploiement suivant :

```Bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Cela va déployer les trois contrats : GameToken, SkinNFT, et Marketplace. Une fois le déploiement terminé, tu verras les adresses des contrats dans la console.

6. Configuration de Pinata (IPFS)

Pour stocker les métadonnées des skins sur IPFS, tu peux utiliser Pinata. Crée un compte sur Pinata et récupère ton API key et secret. Configure-le dans ton projet en ajoutant ces informations dans le fichier .env :
```
PINATA_API_KEY="ton-pinata-api-key"
PINATA_SECRET_KEY="ton-pinata-secret-key"
```
Ensuite, tu peux utiliser l'API Pinata pour uploader les images et métadonnées des skins sur IPFS. Assure-toi que tes métadonnées sont bien associées aux skins via leurs URIs dans le contrat SkinNFT.

7. Lancer le frontend

    Développer le frontend : Utilise un framework comme React ou Next.js pour interagir avec les contrats. Dans le frontend, tu peux récupérer les skins à partir de la blockchain, afficher les détails, et permettre aux utilisateurs d'acheter des skins via le contrat Marketplace.

    Installer les dépendances frontend : Si tu utilises React, tu peux installer les dépendances nécessaires avec :
    ```Bash
    npm install react react-dom ethers
    ```

Lancer le serveur de développement : Si tu utilises create-react-app ou un autre framework, démarre le serveur de développement :
```Bash
    npm start
```

8. Interagir avec la DApp
Une fois que le frontend est lancé, tu peux interagir avec la marketplace directement depuis ton navigateur. Assure-toi que tu es connecté à Metamask et que tu as sélectionné le bon réseau (par exemple, Rinkeby pour les tests).

9. Ajouter des skins
Utilise le contrat SkinNFT pour mint des skins et les ajouter à la marketplace. Tu peux utiliser les fonctions mintSkin dans SkinNFT pour créer de nouveaux skins et listSkin dans Marketplace pour les lister à la vente.

10. Acheter des skins
Les utilisateurs peuvent acheter des skins en utilisant le token GameToken. Lors de l'achat, les fonds seront transférés à l'adresse du vendeur et le skin sera transféré au nouveau propriétaire.
Structure des Contrats
GameToken.sol

Un token ERC-20 qui représente la monnaie de la marketplace. Il est utilisé pour acheter des skins.
SkinNFT.sol

Un token ERC-721 représentant les skins. Chaque skin est unique et peut être acheté/vendu sur la marketplace.
Marketplace.sol

Le contrat de la marketplace, permettant aux utilisateurs de lister leurs skins à la vente et d'acheter des skins avec le GameToken.
Comptes nécessaires

    Compte déployeur : Le compte qui déploie les contrats sur la blockchain. Il doit avoir une clé privée définie dans le fichier .env.

    Compte utilisateur : Les utilisateurs de la marketplace qui achètent et vendent des skins. Ils doivent posséder des tokens GameToken pour effectuer des transactions.

    Compte administrateur : Le propriétaire des contrats (Ownable) qui a la capacité de gérer certaines fonctions, comme le mint des tokens ou des skins.

Tests

    Tests Hardhat : Utilise les tests intégrés pour tester les fonctionnalités des contrats sur un réseau local.
```Bash
npx hardhat test
```