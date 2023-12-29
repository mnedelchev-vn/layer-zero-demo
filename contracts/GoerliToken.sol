// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./layer-zero-contracts/lzApp/LzApp.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract GoerliToken is ERC20, LzApp {
    constructor(address _lzAppEndpoint) ERC20("GoerliToken", "TA") LzApp(_lzAppEndpoint) Ownable(msg.sender) {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function bridgeTokens(uint16 _dstChainId, bytes memory _payload) public payable {
        (, uint256 amount) = abi.decode(_payload, (address, uint256));
        _burn(msg.sender, amount);
        _lzSend(_dstChainId, _payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    function estimateFee(
        uint16 _dstChainId,
        bytes memory _payload,
        bool _useZro,
        bytes calldata _adapterParams
    ) public view returns (uint nativeFee, uint zroFee) {
        return lzEndpoint.estimateFees(_dstChainId, address(this), _payload, _useZro, _adapterParams);
    }

    function _blockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory _payload
    ) internal override {
        (address receiver, uint256 amount) = abi.decode(_payload, (address, uint256));
        require(receiver != address(0));
        require(amount > 0);
        _mint(receiver, amount);
    }
}