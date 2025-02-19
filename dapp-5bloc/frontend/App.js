import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Card, CardContent } from "@/components/ui/card";

const CONTRACT_ADDRESS = "VOTRE_CONTRACT_ADDRESS";
const ABI = [
  // Ajoutez ici l'ABI de votre contrat
];

export default function Marketplace() {
  const [skins, setSkins] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

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

  const fetchSkins = async () => {
    if (contract) {
      // Remplacez par la fonction de récupération des skins
      const totalSupply = await contract.totalSupply();
      let skinList = [];
      for (let i = 0; i < totalSupply; i++) {
        const skin = await contract.skins(i);
        skinList.push(skin);
      }
      setSkins(skinList);
    }
  };

  useEffect(() => {
    fetchSkins();
  }, [contract]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Marketplace de Skins</h1>
      <div className="grid grid-cols-3 gap-4">
        {skins.map((skin, index) => (
          <Card key={index}>
            <CardContent>
              <h2 className="text-lg font-semibold">Skin {index}</h2>
              <p>Rareté: {skin.rarity}</p>
              <p>Prix: {ethers.utils.formatEther(skin.price)} Tokens</p>
              <Button> Acheter </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
