// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


// Importing OpenZeppelin ERC20 contract
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/ERC20.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";

contract FIFACoin is ERC20, Ownable {
    
    uint public initial_supply = 10000;
    
    //address owner;
    
    string private _name;
    string private _symbol;

    constructor() ERC20('FIFACoin','FIFA') {
        //owner = msg.sender;
        //balance[owner] = total_supply;
        
        //8. ERC20 has an internal function _mint . When called, it mints token to the recipient. Create a constructor that calls the _mint function inside the constructor. Mint the 10000 token supply to the owner.
        _mint(Ownable.owner(),initial_supply);

    }
    
    // 9. Make a function that can mint more tokens to the owner.
    
    function mintToOwner(uint _amount) public {
        _mint(Ownable.owner(),_amount);
    }
    
    struct Payment{
        address recipient;
        uint transferAmount;
    }
    
    // 10. Firstly, make your payment record mapping public so that view calls can be made to read the contract’s data.
    
    mapping (address => Payment[]) public payments;
    
    // 11. For the payments record mapping, create a function that takes the sender’s address, the receiver’s address and amount as an input, then creates a new payment record when a transfer is made and adds the new record to the user’s payment record.
    
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        payments[_msgSender()].push(Payment(recipient, amount));
        return true;
    }
    
    // get your Payments in better format
    
    function getAllPayments() public view returns (Payment[] memory) {
        
        return payments[msg.sender];
        
    }
