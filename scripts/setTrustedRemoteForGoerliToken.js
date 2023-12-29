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
    const GoerliTokenAddress = '0x1b0BA6384FC8B9C774454a1c26d28252A8d8708F';
    const SepoliaTokenAddress = '0x69Ca85B124b52ddcdE416541AF09ef1170E5Efa0';
    if (!ethers.isAddress(GoerliTokenAddress) || !ethers.isAddress(GoerliTokenAddress)) {
        console.log('Invalid params');
        return false;
    }

    const GoerliToken = await ethers.getContractAt('GoerliToken', GoerliTokenAddress);
    let tx = await GoerliToken.setTrustedRemote(
        config.SEPOLIA.CHAIN_ID,
        ethers.solidityPacked(["address", "address"], [
            SepoliaTokenAddress,
            GoerliTokenAddress
        ])
    );
    await tx.wait(1);

    // validate the trusted remote setup was successful
    expect(ethers.getAddress(await GoerliToken.getTrustedRemoteAddress(config.SEPOLIA.CHAIN_ID))).to.eq(ethers.getAddress(SepoliaTokenAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});