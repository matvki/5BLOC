// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkinNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    mapping(uint256 => string) public rarities;

    constructor() ERC721("SkinNFT", "SNFT") {}

    function mintSkin(address player, string memory tokenURI, string memory rarity) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newSkinId = _tokenIds;
        _mint(player, newSkinId);
        _setTokenURI(newSkinId, tokenURI);
        rarities[newSkinId] = rarity;
        return newSkinId;
    }
}