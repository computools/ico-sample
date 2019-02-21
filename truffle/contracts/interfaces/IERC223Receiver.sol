pragma solidity ^0.5.3;
 
/**
 * @dev Interface for the smart contract that will handle receiving ERC223 tokens.
 */
contract IERC223Receiver 
{ 
    function tokenFallback(address from, address sender, uint value, bytes memory data) public returns (bool);
}