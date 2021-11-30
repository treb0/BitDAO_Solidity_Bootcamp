//// Smart contract method send

// Library dependency
const Web3 = require('web3');

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

async function nftMint() {

  // Get contract name
  const mint = await encodeNft.methods
  .mintToken(ownerPub, "abc.com")
  .send({ from: ownerPub, gas: 500000 });

  // Log tx info
  console.log(mint);
  console.log(mint.events.Transfer.returnValues);
  console.log(mint.events.Transfer.returnValues.tokenId);

}

nftMint();
