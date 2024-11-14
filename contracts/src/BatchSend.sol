// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./IERC20.sol";
import {Ownable} from "./Ownable.sol";

contract BatchSend is Ownable {
    bool private _entered;

    modifier nonReentrant() {
        require(!_entered, "re-entrant blocked");
        _entered = true;
        _;
        _entered = false;
    }

    function recoverERC20(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(msg.sender, balance);
    }

    function recoverEth() external onlyOwner {
        (bool success,) = msg.sender.call{value: address(this).balance}("");
        require(success, "Recovery failed");
    }

    function sendCustom(IERC20 token, address[] calldata recipients, uint256[] calldata values)
        external
        payable
        nonReentrant
    {
        uint256 total = 0;

        for (uint256 i = 0; i < recipients.length; i++) {
            total += values[i];
        }
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transfer(recipients[i], values[i]));
        }
    }

    function sendCustomSimple(IERC20 token, address[] calldata recipients, uint256[] calldata values)
        external
        payable
        nonReentrant
    {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transferFrom(msg.sender, recipients[i], values[i]));
        }
    }

    function sendFixed(IERC20 token, address[] calldata recipients, uint256 amount) external payable nonReentrant {
        uint256 total = amount * recipients.length;
        require(token.allowance(msg.sender, address(this)) >= total, "Allowance too low");

        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transfer(recipients[i], amount));
        }
    }

    function sendFixedSimple(IERC20 token, address[] calldata recipients, uint256 amount)
        external
        payable
        nonReentrant
    {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transferFrom(msg.sender, recipients[i], amount));
        }
    }
}
