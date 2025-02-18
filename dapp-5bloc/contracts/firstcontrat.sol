// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyContract {
    uint256 public value;

    function setValue(uint256 _newValue) public {
        value = _newValue;
    }
}
