// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkinNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    mapping(uint256 => string) public rarities;  // Rareté du skin
    mapping(uint256 => string) public values;    // Valeur associée au skin
    mapping(uint256 => uint256) public cooldowns; // Cooldown entre transactions

    constructor() ERC721("SkinNFT", "SNFT") {}

    // Fonction de minting d'un skin avec ajout des métadonnées (rareté et valeur)
    function mintSkin(address player, string memory tokenURI, string memory rarity, string memory value) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newSkinId = _tokenIds;
        _mint(player, newSkinId);
        _setTokenURI(newSkinId, tokenURI);
        rarities[newSkinId] = rarity;  // Ajout de la rareté
        values[newSkinId] = value;    // Ajout de la valeur
        return newSkinId;
    }

    // Fonction pour récupérer la rareté d'un skin
    function getRarity(uint256 skinId) external view returns (string memory) {
        return rarities[skinId];
    }

    // Fonction pour récupérer la valeur d'un skin
    function getValue(uint256 skinId) external view returns (string memory) {
        return values[skinId];
    }

    // Fonction pour définir un cooldown entre les achats d'un skin
    function setCooldown(uint256 skinId, uint256 cooldownTime) external onlyOwner {
        cooldowns[skinId] = cooldownTime;
    }

    // Fonction pour obtenir le cooldown actuel d'un skin
    function getCooldown(uint256 skinId) external view returns (uint256) {
        return cooldowns[skinId];
    }
}
