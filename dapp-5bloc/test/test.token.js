// test/GameToken.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameToken Contract", function () {
  let GameToken, gameToken, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    GameToken = await ethers.getContractFactory("GameToken");
    gameToken = await GameToken.deploy();
    await gameToken.deployed();
  });

  it("Should deploy the contract and assign the initial supply", async () => {
    const balance = await gameToken.balanceOf(owner.address);
    expect(balance).to.equal(1000000 * 10 ** 18);
  });

  it("Should allow the owner to mint new tokens", async () => {
    const mintAmount = ethers.utils.parseUnits("1000", 18);
    await gameToken.mint(addr1.address, mintAmount);
    const balance = await gameToken.balanceOf(addr1.address);
    expect(balance).to.equal(mintAmount);
  });

  it("Should not allow non-owners to mint tokens", async () => {
    const mintAmount = ethers.utils.parseUnits("1000", 18);
    await expect(gameToken.connect(addr1).mint(addr2.address, mintAmount))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });
});
