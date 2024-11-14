// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {TestToken} from "../test/test-contracts/TestToken.sol";
import {BatchSend} from "../src/BatchSend.sol";

contract BatchSendScript is Script {
    BatchSend public sender;
    TestToken public token;
    address user1 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(user1);

        sender = new BatchSend();
        token = new TestToken();

        address payable tester = payable(0x886fFE3D8B8851eCDf48888D9c630afd95c85fD1);
        tester.transfer(2e18);

        vm.stopBroadcast();
    }
}
