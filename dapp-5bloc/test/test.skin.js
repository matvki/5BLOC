const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkinNFT Contract", function () {
  let SkinNFT, skinNFT, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    SkinNFT = await ethers.getContractFactory("SkinNFT");
    skinNFT = await SkinNFT.deploy();
    await skinNFT.waitForDeployment(); // Correction ici
  });

  it("Should mint a skin and associate metadata", async () => {
    const tokenURI = "https://white-accused-sole-921.mypinata.cloud/ipfs/bafkreig5gxwqj5h4vsym4ap5fnbj5qo3uyitrwajcbb6w65iggakiy2qyy";
    const rarity = "Epic";
    const value = "1000 tokens";

    // Correction ici : Attendre la transaction et récupérer l'événement
    const tx = await skinNFT.mintSkin(addr1.address, tokenURI, rarity, value);
    const receipt = await tx.wait();
    const newSkinId = receipt.logs[0].args.tokenId; // Assure-toi que ton contrat émet cet événement

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
    await ethers.provider.send("evm_mine"); // Simuler un bloc si nécessaire

    const cooldown = await skinNFT.getCooldown(skinId);
    expect(cooldown).to.equal(cooldownTime);
  });
});
