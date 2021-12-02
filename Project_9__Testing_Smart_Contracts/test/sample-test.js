const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

//https://www.chaijs.com/guide/styles/

//https://docs.openzeppelin.com/test-helpers/0.5/

describe("Volcano Coin", () => {
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  //beforeEach(async () => {
  before(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    expect(contractName).to.equal("Volcano Coin");
    console.log("Contract Name:", contractName);
  });

  it("reverts when transferring tokens to the zero address", async () => {

    await expect(volcanoContract.transfer(constants.ZERO_ADDRESS, 10))
      .to.be.revertedWith('ERC20: transfer to the zero address');

  });

  //homework
  it("has a symbol", async () => {
    let contractSymbol = await volcanoContract.symbol();
    expect(contractSymbol).to.equal("VLC");
    console.log("Symbol:", contractSymbol);
  });

  it("has 18 decimals", async () => {
    let contractDecimals = await volcanoContract.decimals();
    expect(contractDecimals).to.equal(18);
    console.log("Decimals:", contractDecimals);
  });

  it("assigns initial balance", async () => {
    console.log("owner address:",owner.address)
    let initialSupply = await volcanoContract.balanceOf(owner.address);
    expect(initialSupply.toNumber()).to.equal(100000);
    console.log("initialSupply:",initialSupply.toNumber())
  });

  it("increases allowance for address1", async () => {

    // check initial allowance
    let initialAllowance = await volcanoContract.allowance(owner.address, addr1.address);
    console.log('initial allowance: ', initialAllowance.toNumber());

    // add allowance of 100
    allowanceAdd = 100
    console.log('adding additional allowance of',allowanceAdd)
    await volcanoContract.increaseAllowance(addr1.address, allowanceAdd);

    //check new allowance
    let newAllowance = await volcanoContract.allowance(owner.address, addr1.address);
    console.log('new allowance: ', newAllowance.toNumber());

    // test
    expect(newAllowance.toNumber()).to.equal(initialAllowance.toNumber()+allowanceAdd);

  });

  it("decreases allowance for address1", async () => {
    // check initial allowance
    let initialAllowance = await volcanoContract.allowance(owner.address, addr1.address);
    console.log('initial allowance: ', initialAllowance.toNumber());

    // decrease allowance by 50
    allowanceSubstract = 50
    console.log('decreasing allowance by',allowanceSubstract)
    await volcanoContract.decreaseAllowance(addr1.address, allowanceSubstract);

    //check new allowance
    let newAllowance = await volcanoContract.allowance(owner.address, addr1.address);
    console.log('new allowance: ', newAllowance.toNumber());

    // test
    expect(newAllowance.toNumber()).to.equal(initialAllowance.toNumber()-allowanceSubstract);

  });

  it("emits an event when increasing allowance", async () => {

    // increase allowance
    let tx = await volcanoContract.increaseAllowance(addr2.address, 20);
    let completedTx = await tx.wait();

    //console.log(completedTx);

    expectEvent(
      completedTx,
      'Approval',
      { owner: owner.address, spender: addr2.address, value: 20 }
    );

  });

  it("revets decreaseAllowance when trying decrease below 0", async () => {

    await expect(volcanoContract.decreaseAllowance(addr3.address, 1000000000000))
      .to.be.revertedWith('ERC20: decreased allowance below zero');

  });

  it("updates balances on successful transfer from owner to addr1", async () => {

    // check initial balance owner
    let initialBalanceOwner = await volcanoContract.balanceOf(owner.address);
    console.log('initial balance of owner: ', initialBalanceOwner.toNumber());

    // check initial balance addr1
    let initialBalanceAddr1 = await volcanoContract.balanceOf(addr1.address);
    console.log('initial balance of addr1: ', initialBalanceAddr1.toNumber());

    // transfer 100 from owner to addr1
    transferAmount = 100
    console.log('tranfering ',transferAmount,'from owner to addr1')
    await volcanoContract.transfer(addr1.address, transferAmount);

    // check final balance owner
    let newBalanceOwner = await volcanoContract.balanceOf(owner.address);
    console.log('new balance onwer: ', newBalanceOwner.toNumber());
    expect(newBalanceOwner.toNumber()).to.equal(initialBalanceOwner.toNumber() - transferAmount);

    // check final balance addr1
    let newBalanceAddr1 = await volcanoContract.balanceOf(addr1.address);
    console.log('new balance addr1: ', newBalanceAddr1.toNumber());
    expect(newBalanceAddr1.toNumber()).to.equal(initialBalanceAddr1.toNumber() + transferAmount);

  });

  it("revets transfer when sender does not have enough balance", async () => {

    // await expectRevert(
    //   volcanoContract.transfer(addr1.address, 999999999999), 'ERC20: transfer amount exceeds balance'
    // );

    await expect(volcanoContract.transfer(addr1.address, 999999999999))
      .to.be.revertedWith('ERC20: transfer amount exceeds balance');
  });

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {

    // await expectRevert(
    //   volcanoContract.transferFrom(addr1.address,addr2.address,1), 'ERC20: transfer amount exceeds allowance'
    // );


    await expect(volcanoContract.transferFrom(addr1.address,addr2.address,1))
      .to.be.revertedWith('ERC20: transfer amount exceeds allowance');

  });

  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {

    let amountVLC = 60

    // addr1 to give 60 allowance to owner
    let initialAllowance = await volcanoContract.allowance(addr1.address, owner.address);
    console.log('initial allowance: ', initialAllowance.toNumber());
    await volcanoContract.connect(addr1).increaseAllowance(owner.address, amountVLC);
    let newAllowance = await volcanoContract.connect(owner).allowance(addr1.address, owner.address);
    console.log('new allowance: ', newAllowance.toNumber());

    // initial balance addr1
    let initialBalanceAddr1 = await volcanoContract.balanceOf(addr1.address);
    console.log("initial balance of addr1:",initialBalanceAddr1.toNumber())

    // initial balance addr2
    let initialBalanceAddr2 = await volcanoContract.balanceOf(addr2.address);
    console.log("initial balance of addr2:",initialBalanceAddr2.toNumber())

    // transfer via allowance
    await volcanoContract.transferFrom(addr1.address,addr2.address,amountVLC)

    // final balance addr1
    let finalBalanceAddr1 = await volcanoContract.balanceOf(addr1.address);
    console.log("final balance of addr1:",finalBalanceAddr1.toNumber())
    expect(finalBalanceAddr1.toNumber()).to.equal(initialBalanceAddr1.toNumber() - amountVLC);

    // final balance addr2
    let finalBalanceAddr2 = await volcanoContract.balanceOf(addr2.address);
    console.log("final balance of addr2:",finalBalanceAddr2.toNumber())
    expect(finalBalanceAddr2.toNumber()).to.equal(initialBalanceAddr2.toNumber() + amountVLC);

  });
});