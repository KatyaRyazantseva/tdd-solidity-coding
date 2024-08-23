import { expect } from "chai";
import { ethers } from "hardhat";
// https://github.com/dethcrypto/TypeChain
import { HelloWorld } from "../typechain-types";
// https://hardhat.org/hardhat-network-helpers/docs/overview
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

// https://mochajs.org/#getting-started
describe("HelloWorld", function () {

  // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
  async function deployContract() {
  
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
  
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.org/v6/api/contract/#ContractFactory
    const helloWorldContract = await helloWorldFactory.deploy();
    // https://docs.ethers.org/v6/api/contract/#BaseContract-waitForDeployment
    await helloWorldContract.waitForDeployment();
  
    return {helloWorldContract, accounts};
  }

  it("Should give a Hello World", async function () {
    // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
    const { helloWorldContract } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    const helloWorldBytes = await helloWorldContract.helloWorld();
    // https://docs.ethers.org/v6/api/abi/#decodeBytes32String
    const helloWorldText = ethers.decodeBytes32String(helloWorldBytes);
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(helloWorldText).to.equal("Hello World!");
  });

  it("Should set owner to deployer account", async function () {
     // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
     const { helloWorldContract, accounts } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    const contractOwner = await helloWorldContract.owner();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(contractOwner).to.equal(accounts[0].address);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
    const { helloWorldContract, accounts } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContract-connect
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    // https://hardhat.org/hardhat-chai-matchers/docs/overview#reverts
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should execute transferOwnership correctly", async function () {
    const { helloWorldContract, accounts } = await loadFixture(deployContract);
    const testWallet = ethers.Wallet.createRandom();
    const tx = await helloWorldContract.transferOwnership(testWallet.address);
    await tx.wait();
    const contractOwner = await helloWorldContract.owner();
    expect(contractOwner).to.equal(testWallet.address);
  });

  it("Should not allow anyone other than owner to change text", async function () {
    const { helloWorldContract, accounts } = await loadFixture(deployContract);
    const newText = "Solidity";
    const tx = await helloWorldContract.setText(newText);
    await tx.wait();
    const contractOwner = await helloWorldContract.owner();
    await expect(
        helloWorldContract
          .connect(accounts[1])
          .setText(newText)
    ).to.be.revertedWith("Caller is not the owner");
    expect(contractOwner).to.equal(testWallet.address);
  });

  it("Should change text correctly", async function () {
    // TODO
    throw Error("Not implemented");
  });
});