pragma solidity ^0.5.3;

/**
 * @dev ERC223 is based on ERC20 for providing a backward compatibility.
 */
contract IERC20
{
    uint256 public tokenTotalSupply;
    string private tokenName;
    string private tokenSymbol;
    
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function totalSupply() external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function burnOwnTokens(uint256 amountToBurn) external;
    function setCrowdsale(address crowdsaleAddress, uint256 crowdsaleAmount) external;
}