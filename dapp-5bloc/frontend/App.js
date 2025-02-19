import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Card, CardContent } from "@/components/ui/card";

const CONTRACT_ADDRESS = "VOTRE_CONTRACT_ADDRESS";
const ABI = [
  // Ajoutez ici l'ABI de votre contrat
];

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export default function Marketplace() {
  const [skins, setSkins] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Connexion à Ethereum et configuration du contrat
  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      newProvider.send("eth_requestAccounts", []).then(() => {
        const newSigner = newProvider.getSigner();
        setSigner(newSigner);
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, newSigner);
        setContract(newContract);
      });
    }
  }, []);

  // Fonction pour récupérer les skins depuis le contrat
  const fetchSkins = async () => {
    if (contract) {
      const totalSupply = await contract.totalSupply();
      let skinList = [];
      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.tokenByIndex(i);
        const tokenURI = await contract.tokenURI(tokenId);
        const metadataUrl = IPFS_GATEWAY + tokenURI.split("ipfs://")[1]; // Format IPFS URL

        // Récupérer les métadonnées à partir d'IPFS
        const response = await fetch(metadataUrl);
        const metadata = await response.json();

        skinList.push({
          tokenId,
          metadata,
        });
      }
      setSkins(skinList);
    }
  };

  // Appeler fetchSkins dès que le contrat est initialisé
  useEffect(() => {
    fetchSkins();
  }, [contract]);

  // Fonction pour acheter un skin
  const buySkin = async (tokenId, price) => {
    if (contract && signer) {
      const tx = await contract.buySkin(tokenId, {
        value: ethers.utils.parseEther(price.toString()), // Envoi du montant en ETH
      });
      await tx.wait();
      alert(`Skin ${tokenId} acheté avec succès !`);
      fetchSkins(); // Recharger les skins après l'achat
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Marketplace de Skins</h1>
      <div className="grid grid-cols-3 gap-4">
        {skins.length === 0 ? (
          <p>Loading skins...</p>
        ) : (
          skins.map((skin, index) => (
            <Card key={index}>
              <CardContent>
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${skin.metadata.image}`}
                  alt={skin.metadata.name}
                  className="w-full h-auto mb-4"
                />
                <h2 className="text-lg font-semibold">{skin.metadata.name}</h2>
                <p>Rareté: {skin.metadata.rarity}</p>
                <p>Prix: {ethers.utils.formatEther(skin.metadata.price)} Tokens</p>
                <Button onClick={() => buySkin(skin.tokenId, skin.metadata.price)}>
                  Acheter
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
