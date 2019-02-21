pragma solidity ^0.5.3;

import "./utils/Ownable.sol";
import "./interfaces/IERC223.sol";
import './libraries/SafeMath.sol';

/**
 * @dev Crowdsale contract for ERC223 token.
 */
contract Crowdsale is Ownable
{
    using SafeMath for uint256;

    IERC223 private tokenContract;
    uint256 private icoTokenPrice;
    uint256 private icoDeadline;

    uint256 private tokensSold;
    uint256 private currentCap;
    uint256 private softCap; 

    mapping (address => uint256) private investorBalances;
    bool private isStarted;

    event Funded(address indexed from, uint256 amount, uint256 gotTokens, uint256 timestamp);
    event Refunded(address indexed to, uint256 amount);

    constructor (address tokenAddress) public
    {
        tokenContract = IERC223(tokenAddress);
    }

    function startCrowdsale(uint256 _softCap) public onlyOwner
    {
        require(!isStarted, "Crowdsale was already started.");
        isStarted = true;

        uint256 currentTime = now;
        icoDeadline = currentTime + 7 days;
        icoTokenPrice = 1;

        softCap = _softCap;
    }

    /**
    * @dev Provides the opportunity to get the investments back
    * if by the end of the ICO the Soft Cap wasn't reached.
    */
    function refund() external crowdsaleClosed
    {
        require(softCap < currentCap, "Refund is not available - Soft Cap reached.");
        require(investorBalances[msg.sender] > 0, "Nothing to refund for this address.");

        uint256 amount = investorBalances[msg.sender];
        investorBalances[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit Refunded(msg.sender, amount);
    }

    /**
    * @dev Contract owner is able to burn the unsold tokens.
    */
    function burnLeftTokens() external crowdsaleClosed onlyOwner
    {
        uint256 leftTokens = tokenContract.balanceOf(address(this));
        require(leftTokens > 0, "All tokens were sold.");
        tokenContract.burnOwnTokens(leftTokens);
    }

    /**
    * @dev Sends the collected investments to the supplied address.
    * @param beneficiary Receiving address.
    */
    function withdrawCrowdsaleFunds(address payable beneficiary) external crowdsaleClosed onlyOwner
    {
        require(currentCap >= softCap, "Withdrawing is not available - collected funds amount is less than the Soft Cap.");
        beneficiary.transfer(address(this).balance);
    }

    /**
    * @dev Accepts invetor's ETH, calculates the amount of tokens and
    * sends them to investor's balance, returning the ETH if there are
    * less tokens than investor tries to purchase.
    */
    function() payable external crowdsaleOpened
    {
        uint amount = msg.value;
        require(amount > 0, "You have to send some ETH to participate in the ICO.");

        uint256 availableTokens = tokenContract.balanceOf(address(this));
        require(availableTokens > 0, "All tokens were sold.");

        uint tokensForTransfer = amount / icoTokenPrice;
        uint256 returnAmount;
        if (tokensForTransfer > availableTokens)
        {
            returnAmount = amount.sub((amount.mul(availableTokens).div(tokensForTransfer))); 
            amount = amount.sub(returnAmount);
            tokensForTransfer = availableTokens;
        }

        tokensSold = tokensSold.add(tokensForTransfer);
        currentCap = currentCap.add(amount);
        investorBalances[msg.sender] = investorBalances[msg.sender].add(amount);
        emit Funded(msg.sender, amount, tokensForTransfer, now);

        tokenContract.transfer(msg.sender, tokensForTransfer);
        if(returnAmount > 0)
        {
            msg.sender.transfer(returnAmount);
        }
    }

    function getSoldTokensAmount() external view returns(uint256)
    {
        return tokensSold;
    }

    function getLeftTokensAmount() external view returns(uint256)
    {
        return tokenContract.balanceOf(address(this));
    }

    function getSoftCap() external view returns(uint256)
    {
        return softCap;
    }

    function getCurrentCap() external view returns(uint256)
    {
        return currentCap;
    } 
    
    modifier crowdsaleClosed
    {
        require(now >= icoDeadline, "This operation becomes available after the end of the ICO.");
        _;
    }

    modifier crowdsaleOpened
    {
        require(now < icoDeadline, "Crowdsale is closed.");
        _;
    }
}