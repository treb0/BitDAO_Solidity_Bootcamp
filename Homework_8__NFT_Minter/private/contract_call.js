//// Smart contract method call

// Library dependency
console.log('Library dependency');
const Web3 = require('web3');

// Smart contract ABI
console.log('Smart contract ABI');
const nftAbi = require('../artifacts/contracts/EncodeToken.sol/EncodeToken.json');

// Initialise web3 library
console.log('Initialise web3 library');
const web3 = new Web3("http://127.0.0.1:8545");

// Set variable here for reuse
console.log('Set variable here for reuse');
const ownerPub = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

/*
// Initialise contract
console.log('Initialise contract');
const encodeNft = new web3.eth.Contract(nftAbi.abi, '0x5FbDB2315678afecb367f032d93F642f64180aa3')

// run call function
*/




async function nftCall() {

  console.log('Contract Factory')
  const contractFactory = await ethers.getContractFactory("EncodeToken")
  console.log('Getting contract')
  const EncodeToken = await contractFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")

  // Get contract name

  console.log('calling name function');

  //const name = await encodeNft.methods.name().call().toString();

  const name = await EncodeToken.name();

  console.log('printing name');

  console.log(name.toString());
  // Get balance
  //const balance = await encodeNft.methods.balanceOf(ownerPub).call();
  const balance = await EncodeToken.balanceOf(ownerPub);

  // Log balance
  console.log('Balance:')
  console.log(balance.toString());
}

nftCall();


/*

(async () => {
  // Get contract name
  const name = await encodeNft.methods.name().call();

  console.log(name);
  // Get balance
  //const balance = await encodeNft.methods.balanceOf(ownerPub).call();

  // Log balance
  //console.log(balance);
})();

*/