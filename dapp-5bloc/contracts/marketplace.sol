// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;
    IERC721 public skinNFT;
    IERC20 public gameToken;

    event SkinListed(uint256 indexed skinId, address indexed seller, uint256 price);
    event SkinPurchased(uint256 indexed skinId, address indexed buyer);

    constructor(address _skinNFT, address _gameToken) {
        skinNFT = IERC721(_skinNFT);
        gameToken = IERC20(_gameToken);
    }

    function listSkin(uint256 skinId, uint256 price) external {
        require(skinNFT.ownerOf(skinId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than zero");
        
        skinNFT.transferFrom(msg.sender, address(this), skinId);
        listings[skinId] = Listing(msg.sender, price);
        emit SkinListed(skinId, msg.sender, price);
    }

    function buySkin(uint256 skinId) external {
        Listing memory listing = listings[skinId];
        require(listing.price > 0, "Skin not listed");
        
        gameToken.transferFrom(msg.sender, listing.seller, listing.price);
        skinNFT.transferFrom(address(this), msg.sender, skinId);
        delete listings[skinId];
        
        emit SkinPurchased(skinId, msg.sender);
    }
}