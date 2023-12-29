// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { config } = require("./config");

async function main() {
    const GoerliTokenAddress = '';
    const SepoliaTokenAddress = '';
    if (!ethers.isAddress(GoerliTokenAddress) || !ethers.isAddress(GoerliTokenAddress)) {
        console.log('Invalid params');
        return false;
    }

    const SepoliaToken = await ethers.getContractAt('SepoliaToken', SepoliaTokenAddress);
    let tx = await SepoliaToken.setTrustedRemote(
        config.GOERLI.CHAIN_ID,
        ethers.solidityPacked(["address", "address"], [
            GoerliTokenAddress,
            SepoliaTokenAddress
        ])
    );
    await tx.wait(1);

    // validate the trusted remote setup was successful
    expect(ethers.getAddress(await SepoliaToken.getTrustedRemoteAddress(config.GOERLI.CHAIN_ID))).to.eq(ethers.getAddress(GoerliTokenAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});