require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.21",
    networks: {
        goerli: {
            url: process.env.GOERLI_NODE,
            chainId: 5,
            accounts: [process.env.PRIVATE_KEY_OWNER]
        },
        sepolia: {
            url: process.env.SEPOLIA_NODE,
            chainId: 11155111,
            accounts: [process.env.PRIVATE_KEY_OWNER]
        }
    }
};
