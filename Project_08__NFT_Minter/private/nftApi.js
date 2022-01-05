//// Smart contract method send

// Library dependency
const Web3 = require('web3');
const fs = require('fs');

// Smart contract ABI
const nftAbi = require('../artifacts/contracts/EncodeToken.sol/EncodeToken.json');

// Initialise web3 library
const web3 = new Web3("http://127.0.0.1:8545");

// Set variable here for reuse
const ownerPub = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// Add credentials
web3.eth.accounts.wallet.add({
  privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  address: ownerPub
});

// Initialise contract
const encodeNft = new web3.eth.Contract(nftAbi.abi, '0x5FbDB2315678afecb367f032d93F642f64180aa3')

async function nftConnect(contractName, contractAddress) {
  console.log('Connecting to smart contract ERC721')
  const contractFactory = await ethers.getContractFactory(contractName)
  const EncodeToken = await contractFactory.attach(contractAddress)
  const name = await EncodeToken.name();
  console.log(`Connected to smart contract ERC721: ${name.toString()}`);
}


// API

const nftApi = {

  async nftMint(newUri) {

    // mint token
    const mint = await encodeNft.methods
      .mintToken(ownerPub, newUri)
      .send({ from: ownerPub, gas: 500000 });

    // read NFT JSON
    var data = fs.readFileSync('./nfts.json');
    var nftsJson = JSON.parse(data);

    // Save new nft metadata onto nft json
    newNFT = {
      "id": mint.events.Transfer.returnValues.tokenId,
      "uri": newUri,
      "owner": ownerPub
    }
    nftsJson.push(newNFT);
    var updatedNftsJson = JSON.stringify(nftsJson);
    fs.writeFile('./nfts.json', updatedNftsJson, err => {
      // error checking
      if(err) throw err;
      console.log("New NFT metadata added");
      });

    // Log tx info
    console.log(mint);

    // return updated ntfs json
    return nftsJson;
  },

  async nftTransfer(toAddress, tokenId) {

    // console
    console.log(`transfering ownership of tokenId ${tokenId}`)
    console.log(`from ${ownerPub}`)
    console.log(`to ${toAddress}`)

    // execute smart contract transfer function
    const mint = await encodeNft.methods
      .safeTransferFrom(ownerPub,toAddress,tokenId)
      .send({ from: ownerPub, gas: 500000 });
    console.log('transfer complete')
    console.log(mint)

    // read NFT JSON
    console.log('saving onto local nfts json')
    var data = fs.readFileSync('./nfts.json');
    var nftsJson = JSON.parse(data);

    // edit owner
    nftsJson[tokenId-1].owner = toAddress

    //write file
    fs.writeFileSync('./nfts.json', JSON.stringify(nftsJson));
    console.log('changes saved:')
    console.log(nftsJson[tokenId - 1])
    console.log(nftsJson)

    return nftsJson
  }
}

module.exports = nftApi;