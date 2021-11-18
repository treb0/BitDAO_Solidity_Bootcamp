// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


// Importing OpenZeppelin ERC20 contract
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/ERC20.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable {
    
    uint public total_supply = 10000;
    
    address owner;
    
    string private _name;
    string private _symbol;

    constructor() ERC20('Volcano','VOL') {
        owner = msg.sender;
        //balance[owner] = total_supply;
    }
    
    event newSupply (uint);
    
    function increase_supply(uint addSupply) public onlyOwner {
        
        total_supply = total_supply + addSupply;
        
        emit newSupply(total_supply);
    }
    
    
    
    
}
