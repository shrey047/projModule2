// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event BalanceUpdated(uint256 oldBalance, uint256 newBalance);
    event FundsReceived(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function updateBalance(uint256 newBalance) public {
        require(msg.sender == owner, "You are not the owner");
        uint256 oldBalance = balance;
        balance = newBalance;
        emit BalanceUpdated(oldBalance, newBalance);
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    // New function to withdraw all funds from the contract
    function withdrawAll() public {
        require(msg.sender == owner, "You are not the owner");
        uint256 amount = address(this).balance;
        owner.transfer(amount);
        balance = 0; // Update balance after withdrawal
        emit Withdrawal(owner, amount);
        emit BalanceUpdated(amount, 0);
    }

    // New function to receive funds
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
        balance += msg.value; // Increase balance when receiving funds
    }
}
