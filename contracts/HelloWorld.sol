// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract HelloWorld {
    bytes32 text;
    address public owner;

    constructor () {
        text = bytes32("Hello world!");
        owner = msg.sender;
    }

    function helloWorld() external view returns(bytes32) {
        return text;
    }

    function transferOwnership(address newOwner) external {
        require(owner == msg.sender, "Caller is not the owner");
        owner = newOwner;
    }

    function setText(string memory newText) external {
        require(owner == msg.sender, "Caller is not the owner");
        text = bytes32(abi.encodePacked(newText));
    }
}