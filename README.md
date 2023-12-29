# LayerZero bridge between Goerli and Sepolia
This repo demonstrate a LayerZero bridge integration between Goerli and Sepolia testnets. We have a token on Goerli starting with totalSupply of `1000 * 10 ** 18` and a token on Sepolia with totalSupply of `0`. During the tests we're bringing tokens from Goerli to Sepolia and vice versa.

### Setup terminal commands:
* ```npm install``` - Downloading required packages.

### Deployment terminal commands:
* `npx hardhat run scripts/deployGoerliToken.js --network goerli` - Deploys a token on the Goerli chain.
* `npx hardhat run scripts/deploySepoliaToken.js --network sepolia` - Deploys a token on the Sepolia chain.
* `npx hardhat run scripts/setTrustedRemoteForGoerliToken.js --network goerli` - Whitelist the Sepolia Token address to be able to send cross-chain messages to the Goerli token contract. _( Make sure to update the contract addresses in the script. )_
* `npx hardhat run scripts/setTrustedRemoteForSepoliaToken.js --network sepolia` - Whitelist the Goerli Token address to be able to send cross-chain messages to the Sepolia token contract. _( Make sure to update the contract addresses in the script. )_
* `npx hardhat run scripts/bridgeToSepolia.js --network goerli` - Bridging tokens from Goerli to Sepolia. Explained technically we're burning X amount of tokens on Goerli and minting the same amount on Sepolia. _( Make sure to update the contract addresses in the script. )_
* `npx hardhat run scripts/bridgeToGoerli.js --network sepolia` - Bridging tokens from Sepolia to Goerli. Explained technically we're burning X amount of tokens on Sepolia and minting the same amount on Goerli. _( Make sure to update the contract addresses in the script. )_

Inside the bridging part method `bridgeTokens` has the receiver of the tokens as an open field which enables the option if you want to bridge your assets directly on a different address than the `msg.sender`. Like mentioned earlier the briding is actually burning from the starting chain and minting to the destination chain. This way we're making sure that the `totalSupply` value always stays the same even if it's split into multiple chains.

> [!NOTE]  
> Before starting make sure to create .env file containing the following data _( make a copy of .env.example file and rename it to .env )_:
> ```
>   PRIVATE_KEY_OWNER=XYZ
>   GOERLI_NODE=XYZ
>   SEPOLIA_NODE=XYZ
> ```
> - *PRIVATE_KEY_OWNER - the private key used to deploy the contracts. Make sure that you've enough ETH funds on both Goerli and Sepolia chains. *
> - *GOERLI_NODE - Goerli testnet chain RPC URL.*
> - *SEPOLIA_NODE - Sepolia testnet chain RPC URL.*