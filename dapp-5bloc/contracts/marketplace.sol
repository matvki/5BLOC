// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
        uint256 cooldownEndTime; // Temps de fin du cooldown
    }

    mapping(uint256 => Listing) public listings;
    IERC721 public skinNFT;
    IERC20 public gameToken;

    uint256 public cooldownPeriod = 5 minutes; // Délai de cooldown entre les achats successifs

    event SkinListed(uint256 indexed skinId, address indexed seller, uint256 price);
    event SkinPurchased(uint256 indexed skinId, address indexed buyer);

    constructor(address _skinNFT, address _gameToken) {
        skinNFT = IERC721(_skinNFT);
        gameToken = IERC20(_gameToken);
    }

    // Fonction pour lister un skin à vendre sur le marketplace
    function listSkin(uint256 skinId, uint256 price) external {
        require(skinNFT.ownerOf(skinId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than zero");
        
        skinNFT.transferFrom(msg.sender, address(this), skinId);
        listings[skinId] = Listing(msg.sender, price, block.timestamp + cooldownPeriod);  // Lister avec cooldown
        emit SkinListed(skinId, msg.sender, price);
    }

    // Fonction pour acheter un skin sur le marketplace
    function buySkin(uint256 skinId) external {
        Listing storage listing = listings[skinId];
        
        require(listing.price > 0, "Skin not listed");
        require(block.timestamp >= listing.cooldownEndTime, "Cooldown not over");  // Vérification du cooldown

        // Transfert des GameTokens pour acheter le skin
        gameToken.transferFrom(msg.sender, listing.seller, listing.price);
        
        // Transfert du skin à l'acheteur
        skinNFT.transferFrom(address(this), msg.sender, skinId);

        // Supprimer l'objet de la liste après achat
        delete listings[skinId];
        
        emit SkinPurchased(skinId, msg.sender);
    }

    // Permet au propriétaire de modifier le cooldown entre les achats
    function setCooldownPeriod(uint256 _cooldownPeriod) external onlyOwner {
        cooldownPeriod = _cooldownPeriod;
    }
}
