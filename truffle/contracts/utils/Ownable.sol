pragma solidity ^0.5.3;

/**
 * @dev Mainly provides the modifier for calling the smart contract functions 
 * only from the contract's owner address.
 */
contract Ownable 
{
    address private owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public 
    {
        owner = msg.sender;
    }

    modifier onlyOwner() 
    {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function isOwner() public view returns(bool) 
    {
        return msg.sender == owner;
    }

    function transferOwnership(address newOwner) public onlyOwner 
    {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}