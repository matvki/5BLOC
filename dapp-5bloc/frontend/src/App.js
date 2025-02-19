import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { utils } from "ethers";

const CONTRACT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const API = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

export default function Marketplace() {
  const [skins, setSkins] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new Web3Provider(window.ethereum);
      newProvider.send("eth_requestAccounts", []).then(() => {
        const newSigner = newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, API, newSigner);
        setContract(newContract);
      });
    }
  }, []);

  const fetchSkins = async () => {
    if (contract) {
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
          <div key={index}>
            <h2>{skin.rarity}</h2>
            <img src={`https://ipfs.io/ipfs/${skin.uri}`} alt={`Skin ${index}`} />
            <p>Prix: {utils.formatEther(skin.price)} Tokens</p>
          </div>
        ))}
      </div>
    </div>
  );
}
