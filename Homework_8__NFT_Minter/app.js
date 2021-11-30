const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');


import React from 'react';
import ReactDOM from 'react-dom';
//import 'bootstrap/dist/css/bootstrap.css'
import metamask from '.react/metamask.js';
//import * as serviceWorker from './serviceWorker';


// web3
// Library dependency
const Web3 = require('web3');
// Smart contract ABI
//const nftAbi = require('./build/contracts/EncodeErc721.json');  -- original Encode code but seems wrong path
const nftAbi = require('./artifacts/contracts/EncodeToken.sol/EncodeToken.json');
// Initialise web3 library
const web3 = new Web3("http://127.0.0.1:8545");
// Set variable here for reuse
const ownerPub = '0x536F8222C676b6566FF34E539022De6c1c22cc06';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// inmport our NFT api
const nftApi = require('./private/nftApi.js');

app.engine('.mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.get('/', (req, res) =>{

  let nftsfile = fs.readFileSync('./nfts.json', 'UTF-8');
  let nfts = JSON.parse(nftsfile);

  loadWeb3();

  res.render('index',{
      nfts: nfts
  });
});

app.post("/new", (req, res) => {

  console.log("minting new NFT");
  // get inputs
  let newUri = req.body.mint_cid;
  console.log(`New NFT URI: ${newUri}`);

  // mint new token
  //let newNftsJson = nftApi.nftMint(newUri);
  nftApi.nftMint(newUri).then(newNftsJson => {

    console.log(`mint response: ${newNftsJson}`);
    res.render('index',{
          nfts: newNftsJson
    });



    ReactDOM.render(<metamask />, document.getElementById('root'));

  })


  // render page
  //let nftsfile = fs.readFileSync('./nfts.json', 'UTF-8');
  //let nfts = JSON.parse(nftsfile);

  //res.render('index',{
  //    nfts: newNftsJson
  //});

})

app.post("/transfer", (req, res) => {

  // get inputs
  let toAddress = req.body.transfer_newOwner;
  let tokenId = req.body.transfer_tokenId;

  // transfer NFT
  //var transfered = nftApi.nftTransfer(toAddress, tokenId);
  nftApi.nftTransfer(toAddress, tokenId).then(transfered => {
    console.log(`transfer response: ${transfered}`);
    res.render('index',{
      nfts: transfered
    });
  })
  //console.log(`transfer response: ${transfered}`)

  // render page
  //let nftsfile = fs.readFileSync('./nfts.json', 'UTF-8');
  //let nfts = JSON.parse(nftsfile);

  //res.render('index',{
  //    nfts: transfered
  //});

})

const port = 3002;

app.listen(port, () =>{
    console.log(`Server is up and running at port ${port} ...`);
});

