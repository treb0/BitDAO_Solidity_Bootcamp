// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import OpenZeppelin ERC721
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC721/ERC721.sol";

// import OpenZeppelin Ownable
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";

contract VolcanoToken is ERC721, Ownable {
    
    uint256 tokenID = 1;

    string toeknURI = "nothing_yet.com";
    
    // Constructor needed by ERC721 contract
    constructor() ERC721("Volcano", "VOL") { }

    // 5. Make a struct for each token’s metadata. The struct should have a timestamp, the tokenID and a string for the tokenURI.
    struct tokenMeta {
        uint256 tokenID;
        string tokenURI;
        uint256 timestamp;
    }

    tokenMeta[] public tokenArray;

    mapping (address => tokenMeta[]) public ownership;

    // 7. Make a function that mints a token to a user with the token ID.
    function mint() public {

        _mint(msg.sender,tokenID);

        // create struct of new token        
        tokenMeta memory _newToken = tokenMeta(tokenID,toeknURI,block.timestamp);

        // push new token into tokens array
        tokenArray.push(_newToken);

        // push new token into ownership mapping under msg.sender's address
        ownership[msg.sender].push(_newToken);

        tokenID++;

    }

    // 8. Make a function that burns tokens, taking the token ID.
    function burn(uint _tokenId) public {

        // 10. Add a require statement to ensure that only the owner of the token can burn the token
        require(msg.sender == ERC721.ownerOf(_tokenId));

        _burn(_tokenId);

        // 9. Make an internal function that loops over the array of structs and removes the burned tokenID. Call the function inside your burn function.
        _removeTokenFromArray(_tokenId);
        
        // 12
        
        _removeTokenFromMapping(tokenID,msg.sender);
        
    }
    
    function _removeTokenFromArray(uint _tokenId) internal {
        
        for (uint i = 0; i < tokenArray.length - 1; i++) {
            if (tokenArray[i].tokenID == _tokenId) {
                
                tokenArray[i] = tokenArray[tokenArray.length - 1];
                tokenArray.pop();
                
            }
        }
    }

    // 11. Have a look at the implementation of function tokenURI in the parent Open Zeppelin contract, make the necessary changes to your contract to return the correct tokenURI for a particular token ID.
    
    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {

            require(ERC721.ownerOf(_tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");

            for (uint i = 0; i<= _tokenId; i++) {
                
                if (tokenArray[i].tokenID == _tokenId) {

                    return tokenArray[i].tokenURI;
                }
            }
        }

    // 12. We need to remove the token from the mapping. Make an function that deletes the token from the mapping. You can make this an internal function, which can then be called within the burn function.

    function _removeTokenFromMapping(uint _tokenID, address _owner) internal {

        for (uint i = 0; i< ownership[_owner].length; i++) {

            if (ownership[_owner][i].tokenID == _tokenID) {
                delete ownership[_owner][i];
            }   
        }
    }
}
