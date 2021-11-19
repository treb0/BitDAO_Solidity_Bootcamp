// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract VolcanoCoin {
    
    uint public total_supply = 10000;
    
    address owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    event newSupply (uint);
    
    function increase_supply(uint addSupply) public onlyOwner {
        
        total_supply = total_supply + addSupply;
        
        emit newSupply(total_supply);
    }
    
    // 1. In order to keep track of user balances, we need to associate a user’s address with the balance that they have.
    // a) What is the best data structure to hold this association ? >> mapping (dictionary)
    // b) Using your choice of data structure, set up a variable called balance to keep track of the number of volcano coins that a user has.
    
    mapping (address => uint) public balance;
    
    // We want to allow the balance variable to be read from the contract, there are 2 ways to do this.
    // a) What are those ways ? >> declaring it public and creating a get function
    // b) Use one of the ways to make your balances variable visible to users of the contract. >> created it public
    
    // 3. Now change the constructor, to give all of the total supply to the owner of the contract. >> edited
    
    constructor() {
        owner = msg.sender;
        balance[owner] = total_supply;
    }
    
    // 4. Now add a public function called transfer to allow a user to transfer their tokens to another address.
    // This function should have 2 parameters :
    // the amount to transfer and the recipient address.
    // a) Why do we not need the sender’s address here ? >> because we get it from msg.sender
    // b) What would be the implication of having the sender’s address as a parameter ? >> total security breach, anyone could drain another's account
    
    // 5. Add an event to the transfer function to indicate that a transfer has taken place, it should record the amount and the recipient address.
    
    event receivedVolcanos(uint,address);
    
    // 6. We want to keep a record for each user’s transfers. Create a struct called Payment that can be used to hold the transfer amount and the recipient’s address.
    
    struct Payment{
        address recipient;
        uint transferAmount;
    } 
    
    // 7. We want to reference a payments array to each user sending the payment. Create a mapping which returns an array of Payment structs when given this user’s address.
    
    // Payment[] public paymentList;
    
    mapping (address => Payment[]) public payments;
    
    function transfer(uint _transferAmount, address _recipientAddress) public {
        
        require(balance[msg.sender] >= _transferAmount); // sender must have the balance
        require(_transferAmount > 0); // must send, not withdraw, would be an exploitable error
        
        balance[msg.sender] = balance[msg.sender] - _transferAmount;
        
        balance[_recipientAddress] = balance[_recipientAddress] + _transferAmount;
        
        // Add Payment to payments mapping log
        payments[msg.sender].push(Payment(_recipientAddress,_transferAmount));
        
        emit receivedVolcanos(_transferAmount,_recipientAddress);
    }
    
    function getAllPayments() public view returns (Payment[] memory) {
        
        return payments[msg.sender];
        
    }
    
    
    
    
    
}
