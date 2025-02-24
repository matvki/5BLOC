// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** 18);

    constructor() ERC20("GameToken", "GTKN") Ownable(address(msg.sender)) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // Fonction pour "minter" des tokens, uniquement accessible par le propriétaire
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
