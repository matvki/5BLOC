// test/SkinNFT.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkinNFT Contract", function () {
  let SkinNFT, skinNFT, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    SkinNFT = await ethers.getContractFactory("SkinNFT");
    skinNFT = await SkinNFT.deploy();
    await skinNFT.deployed();
  });

  it("Should mint a skin and associate metadata", async () => {
    const tokenURI = "https://ipfs.io/ipfs/skin1";
    const rarity = "Epic";
    const value = "1000 tokens";

    const newSkinId = await skinNFT.mintSkin(addr1.address, tokenURI, rarity, value);
    const skinOwner = await skinNFT.ownerOf(newSkinId);
    const skinURI = await skinNFT.tokenURI(newSkinId);
    const skinRarity = await skinNFT.getRarity(newSkinId);
    const skinValue = await skinNFT.getValue(newSkinId);

    expect(skinOwner).to.equal(addr1.address);
    expect(skinURI).to.equal(tokenURI);
    expect(skinRarity).to.equal(rarity);
    expect(skinValue).to.equal(value);
  });

  it("Should allow cooldown to be set and retrieved", async () => {
    const cooldownTime = 5 * 60; // 5 minutes
    const skinId = 1;

    await skinNFT.setCooldown(skinId, cooldownTime);
    const cooldown = await skinNFT.getCooldown(skinId);

    expect(cooldown).to.equal(cooldownTime);
  });
});
