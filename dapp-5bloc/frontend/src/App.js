import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Skin Épique',
      rarity: 'Épique',
      price: 10, // en tokens (ERC-20)
    },
    {
      id: 2,
      name: 'Skin Légendaire',
      rarity: 'Légendaire',
      price: 20, // en tokens (ERC-20)
    },
    {
      id: 3,
      name: 'Skin Rare',
      rarity: 'Rare',
      price: 5, // en tokens (ERC-20)
    },
  ]);

  // Initialisation du provider et connexion à MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);
    } else {
      alert('MetaMask non détecté. Veuillez installer MetaMask.');
    }
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask n\'est pas installé');
      return;
    }

    try {
      // Demander la connexion à MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      console.log('Compte connecté:', accounts[0]);
    } catch (error) {
      console.error('Erreur de connexion MetaMask:', error);
    }
  };

  const getBalance = async () => {
    if (!account || !provider) return;

    try {
      const balanceWei = await provider.getBalance(account);
      setBalance(ethers.formatEther(balanceWei)); // Affichage du solde en ETH
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
    }
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <h3>Connexion à MetaMask</h3>
        {account ? (
          <div>
            <p>Compte connecté : {account}</p>
            <button onClick={getBalance}>Obtenir le solde</button>
            {balance && <p>Solde: {balance} ETH</p>}
          </div>
        ) : (
          <button onClick={connectMetaMask}>Connecter MetaMask</button>
        )}
      </div>

      <div style={{ marginTop: '100px' }}>
        <h2>Boutique de Skins</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>
              <h3>{item.name}</h3>
              <p>Rareté : {item.rarity}</p>
              <p>Prix : {item.price} Tokens</p>
              <button
                onClick={() => alert(`Achat du skin "${item.name}" effectué !`)}
                style={{
                  padding: '10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Acheter
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
