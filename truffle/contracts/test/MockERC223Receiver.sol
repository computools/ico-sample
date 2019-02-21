pragma solidity ^0.5.3;

import "../interfaces/IERC223Receiver.sol";

contract MockERC223Receiver is IERC223Receiver
{
    constructor() public 
    {
        
    }

    function tokenFallback(address from, address sender, uint value, bytes memory data) public returns (bool)
    {
        return true;
    }
}