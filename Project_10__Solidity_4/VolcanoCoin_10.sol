// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), Ownable {

    uint256  constant initialSupply = 100000;

    // Declaring Payment Types
    string[6] paymentTypes = ["Unknown","Basic payment","Refund","Dividend","Group payment"];
    //mapping(string => bool) public paymentTypes;
    function isPayementType(string memory _ptype) internal view returns(bool) {
        for (uint i=0; i<paymentTypes.length; i++){
            //if (StringUtils.equal(_ptype,paymentTypes[i])) {
            if ( keccak256(bytes(_ptype)) == keccak256(bytes(paymentTypes[i]))) {
                return true;
                }
            }
        return false;
    }

    // 1. Add fields to the payment record for

    struct Payment{
        uint amount;
        address recipient;
        uint id;
        uint timestamp;
        string ptype;
        string comment;
        }

    mapping (address => Payment[]) public payments;

    mapping (uint => address) public payer;

    event supplyChanged(uint256);

    uint public nextPaymentId;

    // 6. Create a address variable for an administrator, this will be set at deploy time.

    address public adminAddress;

    constructor() {
        _mint(msg.sender, initialSupply);
        nextPaymentId = 0;
        adminAddress = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148; // last remix test address
    }

    // 2. Update the transfer function to fill in these fields, initially the payment type will be Unknown, and the comment field blank.

    function transfer(address _recipient, uint _amount) public override virtual returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addPaymentRecord(msg.sender, _recipient, _amount, "Unknown", "");
        return true;
    }

    function addPaymentRecord(address _sender, address _recipient, uint _amount, string memory _ptype, string memory _comment) internal {

        string memory _ptypeParsed;

        if (isPayementType(_ptype) == true ) {
            _ptypeParsed = _ptype;
        } else {
            _ptypeParsed = "Unknown";
        }

        payments[_sender].push(Payment(
                                    _amount,
                                    _recipient,
                                    nextPaymentId,
                                    block.timestamp,
                                    _ptypeParsed,
                                    _comment
                                    ));

        payer[nextPaymentId] = _sender;

        nextPaymentId += 1;
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }

    // 3. Write a new function to allow a user to view all the details for the payments that they have made

    function viewMyPayments() public view returns (Payment[] memory) {
        return payments[msg.sender];
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }

    // 4. Write a function to allow the user to update a particular payment with the payment type and comment
    //   , they will need to specify the identifier, payment type and comment.
    // 5. Make sure you check the parameters in these functions for validity.

    uint txLoc;

    function updatePaymentMeta(uint _id, string memory _type, string memory _comment) external returns(bool) {

        address payerAddress = payer[_id];

        // 7. The administrator should have the ability to update the type of payment for any payment record from any user.
        require((msg.sender == payerAddress)||(msg.sender == adminAddress),"Tx is not from owner, or ID non-existant");

        require(isPayementType(_type) == true,"Incorrect payment type");

        // check for comment?

        // find payment in payments array
        for (uint i=0; i < payments[payerAddress].length; i++){

            if (payments[payerAddress][i].id == _id) {
                txLoc = i;
            }
        }

        // 8. If the administrator updates a payment record the existing comment should have “updated by” plus the administrators address appended to it.

        if (msg.sender == adminAddress) {
            _comment = string(abi.encodePacked(_comment,"..updated by Admin"));
            }

        // update Tx Meta

        payments[payerAddress][txLoc].ptype = _type;
        payments[payerAddress][txLoc].comment = _comment;

        return true;
    }
}