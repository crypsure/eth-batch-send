// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console2} from "forge-std/Test.sol";

import {TestToken} from "./test-contracts/TestToken.sol";
import {SafeMath} from "./test-contracts/zeppelin/SafeMath.sol";
import {IERC20} from "../src/IERC20.sol";
import {BatchSend} from "../src/BatchSend.sol";

contract BatchSendTest is Test {
    TestToken public token;
    BatchSend public batch;
    address[] public recipients;
    uint256[] public amounts;
    uint256 total;
    uint256 recipientCount = 600;

    address user1 = 0x0000000000000000000000000000000000000001;

    function setUp() public {
        hoax(user1, 5 ether);
        token = new TestToken();

        vm.startPrank(user1);
        batch = new BatchSend();

        uint256 weiMul = SafeMath.pow(10, token.decimals());
        total = 0;
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            uint256 amount = SafeMath.mul(weiMul, i * 10);
            recipients.push(address(uint160(i)));
            amounts.push(amount);
            total += amount;
        }
    }

    function testSingleCustom() public {
        uint256 amount = 10e18;
        assertEq(token.balanceOf(user1), 50000000e18);
        // Set up transfer arrays
        address user2 = vm.addr(0x2);
        address[] memory addr = new address[](1);
        addr[0] = address(user2);
        uint256[] memory singleAmount = new uint256[](1);
        singleAmount[0] = amount;
        // Approve balance for transfers
        token.approve(address(batch), amount);
        assertEq(token.allowance(user1, address(batch)), amount);
        // Transfer
        batch.sendCustom(IERC20(token), addr, singleAmount);

        assertEq(token.balanceOf(user2), amount);
    }

    function testCustom() public {
        token.approve(address(batch), total);
        batch.sendCustom(token, recipients, amounts);

        assertEq(token.balanceOf(user1), 50000000e18 - total);
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            uint256 amount = SafeMath.mul(1e18, i * 10);
            assertEq(token.balanceOf(address(uint160(i))), amount);
        }
    }

    function testCustomTip() public {
        uint256 user1Balance = user1.balance;
        token.approve(address(batch), total);
        batch.sendCustom{value: 1e18}(token, recipients, amounts);

        assertEq(token.balanceOf(user1), 50000000e18 - total);
        assertEq(address(batch).balance, 1e18);
        assertEq(user1.balance, user1Balance - 1e18);
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            uint256 amount = SafeMath.mul(1e18, i * 10);
            assertEq(token.balanceOf(address(uint160(i))), amount);
        }

        // Recover tip
        batch.recoverEth();
        assertEq(address(batch).balance, 0);
        assertEq(user1.balance, user1Balance);
    }

    function testCustomSimple() public {
        token.approve(address(batch), total);
        batch.sendCustomSimple(token, recipients, amounts);

        assertEq(token.balanceOf(user1), 50000000e18 - total);
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            uint256 amount = SafeMath.mul(1e18, i * 10);
            assertEq(token.balanceOf(address(uint160(i))), amount);
        }
    }

    function testFixed() public {
        token.approve(address(batch), total);
        batch.sendFixed(token, recipients, 100e18);

        assertEq(token.balanceOf(user1), 50000000e18 - (100e18 * recipientCount));
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            assertEq(token.balanceOf(address(uint160(i))), 100e18);
        }
    }

    function testFixedTip() public {
        uint256 user1Balance = user1.balance;
        token.approve(address(batch), total);
        batch.sendFixed{value: 1e18}(token, recipients, 100e18);

        assertEq(token.balanceOf(user1), 50000000e18 - (100e18 * recipientCount));
        assertEq(address(batch).balance, 1e18);
        assertEq(user1.balance, user1Balance - 1e18);
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            assertEq(token.balanceOf(address(uint160(i))), 100e18);
        }
        // Recover tip
        batch.recoverEth();
        assertEq(address(batch).balance, 0);
        assertEq(user1.balance, user1Balance);
    }

    function testRecoverToken() public {
        token.transfer(address(batch), 2e18);
        assertEq(token.balanceOf(address(batch)), 2e18);
        assertEq(token.balanceOf(user1), 50000000e18 - 2e18);

        batch.recoverERC20(address(token));
        assertEq(token.balanceOf(address(batch)), 0);
        assertEq(token.balanceOf(user1), 50000000e18);
    }

    function testExpectRecoverEthError() public {
        token.approve(address(batch), total);
        batch.sendFixed{value: 1e18}(token, recipients, 100e18);

        // Non owner attempts to recover tip
        vm.startPrank(vm.addr(0x2));
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        batch.recoverEth();
    }

    function testExpectRecoverTokenError() public {
        token.transfer(address(batch), total);

        // Non owner attempts to recover tip
        vm.startPrank(vm.addr(0x2));
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        batch.recoverERC20(address(token));
    }

    function testFixedSimple() public {
        token.approve(address(batch), total);
        batch.sendFixedSimple(token, recipients, 100e18);

        assertEq(token.balanceOf(user1), 50000000e18 - (100e18 * recipientCount));
        for (uint256 i = 3; i < 3 + recipientCount; i++) {
            assertEq(token.balanceOf(address(uint160(i))), 100e18);
        }
    }

    function testFixedGas() public {
        token.approve(address(batch), total * 10);
        batch.sendFixed(token, recipients, 10e18);
        batch.sendFixed(token, recipients, 10e18);
        batch.sendFixed(token, recipients, 10e18);
        batch.sendFixed(token, recipients, 10e18);
        batch.sendFixed(token, recipients, 10e18);

        assertEq(token.balanceOf(user1), 50000000e18 - (10e18 * recipientCount * 5));
    }

    function testCustomGas() public {
        token.approve(address(batch), total * 10);
        batch.sendCustom(token, recipients, amounts);
        batch.sendCustom(token, recipients, amounts);
        batch.sendCustom(token, recipients, amounts);
        batch.sendCustom(token, recipients, amounts);
        batch.sendCustom(token, recipients, amounts);

        assertEq(token.balanceOf(user1), 50000000e18 - (total * 5));
    }
}
