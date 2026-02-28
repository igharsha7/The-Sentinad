// ==========================================
// THE SENTINAD — Sample Contracts for Demo
// ==========================================
// These are used to simulate contract audits during the demo.
// Each includes realistic Solidity source code.

export interface SampleContract {
  address: string;
  name: string;
  sourceCode: string;
  expectedVerdict: "safe" | "scam";
}

export const SAFE_CONTRACT: SampleContract = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28",
  name: "PurpleToken",
  sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PurpleToken
 * @notice A clean, standard ERC-20 token on Monad.
 * No hidden fees, no blacklists, no tricks.
 */
contract PurpleToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    constructor() ERC20("PurpleToken", "PRPL") Ownable(msg.sender) {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}`,
  expectedVerdict: "safe",
};

export const SAFE_CONTRACT_2: SampleContract = {
  address: "0x8B3a08b22f35F0468A3C3396b2dc3b8C9C6C8288",
  name: "MonadVault",
  sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MonadVault
 * @notice Simple staking vault. Users deposit tokens and earn rewards.
 * Clean implementation with standard patterns.
 */
contract MonadVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    mapping(address => uint256) public balances;
    uint256 public totalStaked;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        stakingToken = IERC20(_token);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        totalStaked += amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        totalStaked -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
}`,
  expectedVerdict: "safe",
};

export const HONEYPOT_CONTRACT: SampleContract = {
  address: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
  name: "SafeMoonV3",
  sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SafeMoonV3 - "The Next 1000x Gem"
 * @notice Looks like a normal token. It's not.
 */
contract SafeMoonV3 {
    string public name = "SafeMoonV3";
    string public symbol = "SFM3";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) private _blocked;
    
    // Hidden: only owner can sell
    address private _router;
    bool private _tradingEnabled = false;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalSupply = 1_000_000_000 * 10**18;
        balanceOf[msg.sender] = totalSupply;
        _router = msg.sender; // Owner is secretly the "router"
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _transfer(msg.sender, to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        allowance[from][msg.sender] -= amount;
        return _transfer(from, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(!_blocked[from], "Address blocked");
        
        // HONEYPOT: Only owner/router can sell. Everyone else is trapped.
        if (to == _router || to == address(0)) {
            require(from == owner || from == _router, "Trading not available");
        }

        // Hidden 25% sell tax that goes to owner
        uint256 taxAmount = 0;
        if (to == _router && from != owner) {
            taxAmount = (amount * 25) / 100;
            balanceOf[owner] += taxAmount;
        }
        
        uint256 transferAmount = amount - taxAmount;
        balanceOf[from] -= amount;
        balanceOf[to] += transferAmount;
        
        emit Transfer(from, to, transferAmount);
        return true;
    }

    // Owner can block anyone from selling
    function setBlocked(address account, bool blocked) external onlyOwner {
        _blocked[account] = blocked;
    }

    // Owner can enable/disable trading at will
    function setTradingEnabled(bool enabled) external onlyOwner {
        _tradingEnabled = enabled;
    }

    // Owner drains any tokens sent to contract
    function rescueTokens(address token) external onlyOwner {
        uint256 balance = balanceOf[address(this)];
        balanceOf[address(this)] = 0;
        balanceOf[owner] += balance;
    }
}`,
  expectedVerdict: "scam",
};

export const RUGPULL_CONTRACT: SampleContract = {
  address: "0xBaDc0deBaDc0deBaDc0deBaDc0deBaDc0deBaDc0d",
  name: "YieldMaxPro",
  sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title YieldMaxPro - "Guaranteed 500% APY"
 * @notice Classic rug pull. Owner can mint unlimited tokens and drain LP.
 */
contract YieldMaxPro {
    string public name = "YieldMaxPro";
    string public symbol = "YMP";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Hidden minting capability
    uint256 private _maxMint = type(uint256).max;
    
    // Hidden fee that can be set to 100%
    uint256 public sellFee = 2; // Starts at 2%, looks innocent
    
    event Transfer(address indexed from, address indexed to, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
        totalSupply = 100_000_000 * 10**18;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _transfer(msg.sender, to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount);
        allowance[from][msg.sender] -= amount;
        return _transfer(from, to, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        require(balanceOf[from] >= amount, "Low balance");

        // Apply sell fee — owner takes the fee
        uint256 fee = (amount * sellFee) / 100;
        uint256 net = amount - fee;

        balanceOf[from] -= amount;
        balanceOf[to] += net;
        if (fee > 0) {
            balanceOf[owner] += fee;
        }

        emit Transfer(from, to, net);
        return true;
    }

    // RUG: Owner can set fee to 100% at any time
    function setSellFee(uint256 newFee) external onlyOwner {
        sellFee = newFee; // No cap! Can be set to 100
    }

    // RUG: Owner can mint unlimited tokens to dump on holders
    function mint(address to, uint256 amount) external onlyOwner {
        require(amount <= _maxMint, "Over max");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    // RUG: Owner can drain all ETH from the contract
    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // RUG: Owner can drain any ERC20 from the contract
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        (bool success, ) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", owner, amount)
        );
        require(success);
    }

    receive() external payable {}
}`,
  expectedVerdict: "scam",
};

/**
 * All sample contracts in rotation order for the demo.
 * Alternates between scam and safe for dramatic effect.
 */
export const DEMO_CONTRACTS: SampleContract[] = [
  HONEYPOT_CONTRACT,     // First: scam → dramatic roast
  SAFE_CONTRACT,         // Then: safe → successful trade
  RUGPULL_CONTRACT,      // Another scam → another roast
  SAFE_CONTRACT_2,       // Safe again → another trade
];

/**
 * Get the next contract in the demo rotation.
 */
let demoIndex = 0;
export function getNextDemoContract(): SampleContract {
  const contract = DEMO_CONTRACTS[demoIndex];
  demoIndex = (demoIndex + 1) % DEMO_CONTRACTS.length;
  return contract;
}
