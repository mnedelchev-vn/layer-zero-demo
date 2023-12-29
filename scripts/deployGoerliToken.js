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
    const GoerliToken = await ethers.deployContract("GoerliToken", [config.GOERLI.ENDPOINT]);
    await GoerliToken.waitForDeployment();

    console.log(
        `GoerliToken token deployed to ${GoerliToken.target}`
    );

    // validate totalSupply
    expect(await GoerliToken.totalSupply()).to.eq('1000000000000000000000');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});