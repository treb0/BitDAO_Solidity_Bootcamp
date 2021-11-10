// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract VolcanoCoin {
    
    uint public total_supply = 10000;
    
    address owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    event newSupply (uint);
    
    function increase_supply(uint addSupply) public onlyOwner {
        
        total_supply = total_supply + addSupply;
        
        emit newSupply(total_supply);
        
    }
}