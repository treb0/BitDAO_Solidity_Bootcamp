// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Score {
    
uint public score;

address public owner;

modifier onlyOwner() {
    if(msg.sender == owner){
        _;
    }
}

event scoreSet (uint);

constructor() {
    score = 5;
    owner = msg.sender;
}


function setScore(uint _newScore) public {
    score = _newScore;
    emit scoreSet(_newScore);
}



}