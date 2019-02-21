pragma solidity ^0.5.3;

import "./IERC20.sol";

/**
 * @dev Interface for ERC223 token - https://github.com/ethereum/EIPs/issues/223
 */
contract IERC223 is IERC20
{
    function transfer(address to, uint value, bytes memory data) public returns (bool);
    function transferFrom(address from, address to, uint value, bytes memory data) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}