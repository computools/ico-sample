pragma solidity ^0.5.3;

library SafeMath 
{
    function mul(uint256 a, uint256 b) internal pure returns (uint256) 
    {
        if (a == 0) 
        {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "Multiplying error.");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) 
    {
        require(b > 0, "Division error.");
        uint256 c = a / b;
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) 
    {
        require(b <= a, "Subtraction error.");
        uint256 c = a - b;
        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) 
    {
        uint256 c = a + b;
        require(c >= a, "Adding error.");
        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) 
    {
        require(b != 0, "Mod error.");
        return a % b;
    }
}