const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

var ERC223 = artifacts.require("ERC223.sol");
const Crowdsale = artifacts.require("Crowdsale.sol");
const MockERC223Receiver = artifacts.require("MockERC223Receiver.sol");
const MockNonERC223Receiver = artifacts.require("MockNonERC223Receiver.sol");

contract('ERC223', (accounts) => {
    let erc223;
    let crowdsale;
    let mockERC223Receiver;
    let mockNonERC223Receiver;

    const accountOwner = accounts[0];
    const accountRecepient1 = accounts[1];
    const accountRecepient2 = accounts[2];
    const accountCrowdsale = accounts[3];

    const DECIMALS = "000000000000000000";
    const initialTotalSupply = "100000000" + DECIMALS;
    const balanceCrowdsale = "100000000" + DECIMALS;

    const belowOwnerBalance = "99999999" + DECIMALS;
    const exceedsOwnerBalance = "100000001" + DECIMALS;
    const batchAmount = "50000000" + DECIMALS;

    beforeEach(async () => {
        erc223 = await ERC223.new("TOKEN", "TKN", initialTotalSupply, {from: accountOwner});             
        crowdsale = await Crowdsale.new(erc223.address, {from: accountOwner});

        mockERC223Receiver = await MockERC223Receiver.new({from: accountOwner});
        mockNonERC223Receiver = await MockNonERC223Receiver.new({from: accountOwner});
    });

    it("should get correct initial balance", async function() {
        let actualTotalSupply = await erc223.totalSupply();
        assert.equal(actualTotalSupply, initialTotalSupply);

        let actualBalanceOwner = await erc223.balanceOf(accountOwner);
        assert.equal(actualBalanceOwner, initialTotalSupply);
    });

    it("should be able to transfer tokens", async function() {
        await erc223.transfer(accountRecepient1, initialTotalSupply);

        let balanceSender = await erc223.balanceOf(accountOwner);
        assert.equal(balanceSender, 0);

        let balanceRecepient = await erc223.balanceOf(accountRecepient1);
        assert.equal(balanceRecepient, initialTotalSupply);
    });

    it("should not be able to transfer tokens to the contract address", async function() {
        await truffleAssert.reverts(
            erc223.transfer(erc223.address, initialTotalSupply),
            truffleAssert.ErrorType.REVERT,
            "The address can't point to smart contract."
        );
    });

    it("should be able to transfer tokens in a batch", async function() {
        var addressesArray = [accountRecepient1, accountRecepient2];
        await erc223.transferBatch(addressesArray, batchAmount, {from: accountOwner});

        let balanceSender = await erc223.balanceOf(accountOwner);
        assert.equal(balanceSender, 0);

        let balanceRecepient1 = await erc223.balanceOf(accountRecepient1);
        assert.equal(balanceRecepient1, batchAmount);

        let balanceRecepient2 = await erc223.balanceOf(accountRecepient2);
        assert.equal(balanceRecepient2, batchAmount);
    });

    it("should not be able to transfer more than own balance", async function() {
        await truffleAssert.reverts(
            erc223.transfer(accountRecepient1, exceedsOwnerBalance),
            truffleAssert.ErrorType.REVERT,
            "Specified balance has less tokens than required for this operation."
        );
    });

    it("should not be able to transfer in a batch more than own balance", async function() {
        var addressesArray = [accountRecepient1, accountRecepient2];
        await truffleAssert.reverts(
            erc223.transferBatch(addressesArray, exceedsOwnerBalance, {from: accountOwner}),
            truffleAssert.ErrorType.REVERT,
            "Specified address has less tokens than required for this operation."
        );
    });

    it("should not be able to transfer tokens in a batch to the contract address", async function() {
        var addressesArray = [accountRecepient1, erc223.address];
        await truffleAssert.reverts(
            erc223.transferBatch(addressesArray, batchAmount, {from: accountOwner}),
            truffleAssert.ErrorType.REVERT,
            "The address can't point to Egg smart contract."
        );
    });

    it("should be able to transfer tokens from another account", async function() {
        await erc223.approve(accountCrowdsale, initialTotalSupply, {from: accountOwner});
        await erc223.transferFrom(accountOwner, accountRecepient1, initialTotalSupply, {from: accountCrowdsale});

        let balanceSender = await erc223.balanceOf(accountOwner);
        assert.equal(balanceSender, 0);

        let balanceRecepient = await erc223.balanceOf(accountRecepient1);
        assert.equal(balanceRecepient, initialTotalSupply);

        let balanceOperator = await erc223.balanceOf(accountCrowdsale);
        assert.equal(balanceOperator, 0);
    });

    it("should not be able to transfer from another account more than allowed", async function() {
        await erc223.approve(accountCrowdsale, belowOwnerBalance, {from: accountOwner});
        await truffleAssert.reverts(
            erc223.transferFrom(accountOwner, accountRecepient1, initialTotalSupply, {from: accountCrowdsale}),
            truffleAssert.ErrorType.REVERT,
            "Transfer value exceeds the allowance."
        );
    });

    it("should be able to set and start a crowdsale if an owner", async function() {
        await erc223.setCrowdsale(accountCrowdsale, balanceCrowdsale, {from: accountOwner});
        await crowdsale.startCrowdsale(web3.utils.toWei("10", 'ether'), {from: accountOwner});

        let actualBalanceCrowdsale = await erc223.balanceOf(accountCrowdsale);
        assert.equal(balanceCrowdsale, actualBalanceCrowdsale);
    });

    it("should not be able to set a crowdsale if not an owner", async function() {
        await truffleAssert.reverts(
            erc223.setCrowdsale(accountCrowdsale, balanceCrowdsale, {from: accountCrowdsale}),
            truffleAssert.ErrorType.REVERT,
            "Only owner can call this function."
        );
    });

    it("should not be able to set a crowdsale twice", async function() {
        await erc223.setCrowdsale(accountCrowdsale, balanceCrowdsale, {from: accountOwner});

        await truffleAssert.reverts(
            erc223.setCrowdsale(accountCrowdsale, balanceCrowdsale, {from: accountOwner}),
            truffleAssert.ErrorType.REVERT,
            "Crowdsale address was already set."
        );
    });

    it("should be able to send tokens to the ERC223Receiver smart contract", async function() {
        await erc223.transfer(mockERC223Receiver.address, initialTotalSupply);

        let balanceSender = await erc223.balanceOf(accountOwner);
        assert.equal(balanceSender, 0);

        let balanceRecepient = await erc223.balanceOf(mockERC223Receiver.address);
        assert.equal(balanceRecepient, initialTotalSupply);
    });

    it("should not be able to send tokens to the non-ERC223Receiver smart contract", async function() {
        await truffleAssert.reverts(
            erc223.transfer(mockNonERC223Receiver.address, initialTotalSupply),
            truffleAssert.ErrorType.REVERT
        );
    });
})