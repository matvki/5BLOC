const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract", function () {
  let myContract;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
    const MyContract = await ethers.getContractFactory("MyContract");
    myContract = await MyContract.deploy();
    await myContract.waitForDeployment();
  });

  it("Devrait avoir une valeur initiale de 0", async function () {
    expect(await myContract.value()).to.equal(0);
  });

  it("Devrait mettre à jour la valeur", async function () {
    await myContract.setValue(42);
    expect(await myContract.value()).to.equal(42);
  });
});
