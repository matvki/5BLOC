// test/Marketplace.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let GameToken, skinNFT, Marketplace, gameToken, nft, marketplace, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Déployer le contrat GameToken
    GameToken = await ethers.getContractFactory("GameToken");
    gameToken = await GameToken.deploy();
    await gameToken.waitForDeployment();

    // Déployer le contrat SkinNFT
    skinNFT = await ethers.getContractFactory("SkinNFT");
    nft = await skinNFT.deploy();
    await nft.waitForDeployment();

    // Déployer le contrat Marketplace
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(nft.address, gameToken.address);
    await marketplace.waitForDeployment();

    // Mint un skin pour addr1
    const tokenURI = "https://white-accused-sole-921.mypinata.cloud/ipfs/bafkreig5gxwqj5h4vsym4ap5fnbj5qo3uyitrwajcbb6w65iggakiy2qyy";
    const rarity = "Epic";
    const value = "1000 tokens";
    await nft.mintSkin(addr1.address, tokenURI, rarity, value);

    // Mint des GameTokens pour addr2
    const mintAmount = ethers.utils.parseUnits("1000", 18);
    await gameToken.mint(addr2.address, mintAmount);
    await gameToken.connect(addr2).approve(marketplace.address, mintAmount);
  });

  it("Should allow a user to list and buy a skin", async () => {
    const skinId = 1;
    const price = ethers.utils.parseUnits("100", 18);

    await marketplace.connect(addr1).listSkin(skinId, price);

    const listing = await marketplace.listings(skinId);
    expect(listing.seller).to.equal(addr1.address);
    expect(listing.price).to.equal(price);

    await marketplace.connect(addr2).buySkin(skinId);

    const buyer = await nft.ownerOf(skinId);
    expect(buyer).to.equal(addr2.address);
  });

  it("Should not allow purchase if cooldown is not over", async () => {
    const skinId = 1;
    const price = ethers.utils.parseUnits("100", 18);

    await marketplace.connect(addr1).listSkin(skinId, price);

    const listing = await marketplace.listings(skinId);
    expect(listing.seller).to.equal(addr1.address);
    expect(listing.price).to.equal(price);

    // Essayer d'acheter avant le cooldown
    await expect(marketplace.connect(addr2).buySkin(skinId))
      .to.be.revertedWith("Cooldown not over");
  });

  it("Should allow cooldown to be configured and respected", async () => {
    const skinId = 1;
    const price = ethers.utils.parseUnits("100", 18);
    const cooldownTime = 5 * 60; // 5 minutes

    await marketplace.connect(addr1).listSkin(skinId, price);
    await nft.setCooldown(skinId, cooldownTime);

    // Acheter le skin après le cooldown
    await network.provider.send("evm_increaseTime", [cooldownTime + 1]);
    await marketplace.connect(addr2).buySkin(skinId);

    const buyer = await nft.ownerOf(skinId);
    expect(buyer).to.equal(addr2.address);
  });
});
