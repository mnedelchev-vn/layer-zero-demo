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
    const GoerliTokenAddress = '';
    if (!ethers.isAddress(GoerliTokenAddress)) {
        console.log('Invalid params');
        return false;
    }

    const GoerliToken = await ethers.getContractAt('GoerliToken', GoerliTokenAddress);
    const payload = abiCoder.encode(["address", "uint"], [
        owner.address,
        '1000000000000000000'
    ]);
    const estimateFee = await GoerliToken.estimateFee(
        config.SEPOLIA.CHAIN_ID,
        payload,
        false,
        '0x'
    );
    console.log('estimateFee: ', estimateFee);
    
    const ownerTokenBalance = await GoerliToken.balanceOf(owner.address);
    const totalSupply = await GoerliToken.totalSupply();

    console.log('Goerli ownerTokenBalance before bridging: ', ownerTokenBalance);
    console.log('Goerli totalSupply before bridging: ', totalSupply);

    let tx = await GoerliToken.connect(owner).bridgeTokens(config.SEPOLIA.CHAIN_ID, payload, {value: estimateFee[0]});
    await tx.wait(1);
    
    const ownerTokenBalanceAfter = await GoerliToken.balanceOf(owner.address);
    const totalSupplyAfter = await GoerliToken.totalSupply();

    expect(ownerTokenBalance).to.be.greaterThan(ownerTokenBalanceAfter);
    expect(totalSupply).to.be.greaterThan(totalSupplyAfter);

    console.log('Goerli ownerTokenBalance after bridging: ', ownerTokenBalanceAfter);
    console.log('Goerli totalSupply after bridging: ', totalSupplyAfter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});