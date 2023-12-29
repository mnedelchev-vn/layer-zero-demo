// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require("dotenv").config();
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { config } = require("./config");

async function main() {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const [owner] = await ethers.getSigners();
    const SepoliaTokenAddress = '0x69Ca85B124b52ddcdE416541AF09ef1170E5Efa0';
    if (!ethers.isAddress(SepoliaTokenAddress)) {
        console.log('Invalid params');
        return false;
    }

    const SepoliaToken = await ethers.getContractAt('SepoliaToken', SepoliaTokenAddress);
    const payload = abiCoder.encode(["address", "uint"], [
        owner.address,
        '500000000000000000'
    ]);
    const estimateFee = await SepoliaToken.estimateFee(
        config.GOERLI.CHAIN_ID,
        payload,
        false,
        '0x'
    );
    console.log('estimateFee: ', estimateFee);
    
    const ownerTokenBalance = await SepoliaToken.balanceOf(owner.address);
    const totalSupply = await SepoliaToken.totalSupply();

    console.log('Sepolia ownerTokenBalance before bridging: ', ownerTokenBalance);
    console.log('Sepolia totalSupply before bridging: ', totalSupply);

    let tx = await SepoliaToken.connect(owner).bridgeTokens(config.GOERLI.CHAIN_ID, payload, {value: estimateFee[0]});
    await tx.wait(1);
    
    const ownerTokenBalanceAfter = await SepoliaToken.balanceOf(owner.address);
    const totalSupplyAfter = await SepoliaToken.totalSupply();

    expect(ownerTokenBalance).to.be.greaterThan(ownerTokenBalanceAfter);
    expect(totalSupply).to.be.greaterThan(totalSupplyAfter);

    console.log('Sepolia ownerTokenBalance after bridging: ', ownerTokenBalanceAfter);
    console.log('Sepolia totalSupply after bridging: ', totalSupplyAfter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});