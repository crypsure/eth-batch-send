// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../../src/Ownable.sol";
import "./zeppelin/ERC20Burnable.sol";
import "./zeppelin/SafeMath.sol";

/// @title Batch Send Test Token
/// @author Crypsure
/// @notice Batch Send Test ERC20 token (BST)
contract TestToken is Ownable, ERC20Burnable {
    constructor() ERC20("BatchSendTest", "BST") {
        uint256 totalSupply = SafeMath.mul(SafeMath.pow(10, decimals()), 100000000);
        _mint(msg.sender, totalSupply);

        transfer(0x0000000000000000000000000000000000000001, SafeMath.mul(SafeMath.pow(10, decimals()), 50000000));
        transfer(0x29017D4D9312E9e9A5968010692263C3e7f988E4, SafeMath.mul(SafeMath.pow(10, decimals()), 50000000));
    }
}
