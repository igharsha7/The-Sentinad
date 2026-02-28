// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Arbiter
 * @notice The Sentinad's on-chain arbitrage execution contract.
 * @dev Deployed on Monad Testnet. Handles flash arbitrage execution events
 *      and serves as the on-chain component of the multi-agent system.
 *      Trade execution is simulated in the MVP — this contract emits events
 *      for transparency and provides read-only functions for authenticity.
 */
contract Arbiter {
    address public owner;
    uint256 public totalArbitrages;
    uint256 public totalProfitWei;

    struct ArbitrageRecord {
        address tokenA;
        address tokenB;
        string buyDex;
        string sellDex;
        uint256 profit;
        uint256 timestamp;
    }

    ArbitrageRecord[] public records;

    event ArbitrageExecuted(
        address indexed tokenA,
        address indexed tokenB,
        string buyDex,
        string sellDex,
        uint256 profit,
        uint256 timestamp
    );

    event VibeCheckPassed(
        address indexed contractAddress,
        uint256 confidence,
        uint256 timestamp
    );

    event ScamDetected(
        address indexed contractAddress,
        string roast,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Arbiter: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Log a successful arbitrage execution
     * @dev Called by the backend executor agent after a simulated trade
     */
    function logArbitrage(
        address tokenA,
        address tokenB,
        string calldata buyDex,
        string calldata sellDex,
        uint256 profit
    ) external onlyOwner {
        totalArbitrages++;
        totalProfitWei += profit;

        records.push(ArbitrageRecord({
            tokenA: tokenA,
            tokenB: tokenB,
            buyDex: buyDex,
            sellDex: sellDex,
            profit: profit,
            timestamp: block.timestamp
        }));

        emit ArbitrageExecuted(tokenA, tokenB, buyDex, sellDex, profit, block.timestamp);
    }

    /**
     * @notice Log a passed vibe check
     */
    function logVibeCheck(
        address contractAddress,
        uint256 confidence
    ) external onlyOwner {
        emit VibeCheckPassed(contractAddress, confidence, block.timestamp);
    }

    /**
     * @notice Log a detected scam
     */
    function logScam(
        address contractAddress,
        string calldata roast
    ) external onlyOwner {
        emit ScamDetected(contractAddress, roast, block.timestamp);
    }

    /**
     * @notice Get the stats of this Arbiter
     */
    function getStats() external view returns (uint256, uint256) {
        return (totalArbitrages, totalProfitWei);
    }

    /**
     * @notice Get the total number of recorded arbitrages
     */
    function getRecordCount() external view returns (uint256) {
        return records.length;
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Arbiter: zero address");
        owner = newOwner;
    }
}
