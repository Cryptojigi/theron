// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IYieldDistributor} from "./Interfaces.sol";

/**
 * @title TheronToken
 * @dev ERC-4626 fund share token (TRN) for the Theron AI-Managed RWA Fund.
 * Maintains a strict 1:1 peg with the deposited principal.
 * Yield is handled externally via YieldDistributor to prevent NAV double-counting.
 */
contract TheronToken is ERC20, ERC20Permit, ERC4626, Ownable {
    IYieldDistributor public yieldDistributor;

    /**
     * @param _asset The underlying ERC20 asset (WBOT)
     */
    constructor(IERC20 _asset, address initialOwner)
        ERC20("Theron Fund Share", "TRN")
        ERC20Permit("Theron Fund Share")
        ERC4626(_asset)
        Ownable(initialOwner)
    {}

    function setYieldDistributor(address _yieldDistributor) external onlyOwner {
        yieldDistributor = IYieldDistributor(_yieldDistributor);
    }

    function _update(address from, address to, uint256 value) internal virtual override(ERC20) {
        if (address(yieldDistributor) != address(0)) {
            yieldDistributor.updateYield(from, to);
        }
        super._update(from, to, value);
    }

    function decimals() public view virtual override(ERC20, ERC4626) returns (uint8) {
        return ERC4626.decimals();
    }

    /**
     * @dev Overrides totalAssets to always return totalSupply().
     * This enforces a strict 1:1 peg (1 TRN = 1 WBOT) for principal accounting.
     * Yield is distributed separately via YieldDistributor, avoiding NAV appreciation.
     * Any rogue WBOT sent directly to this contract will not affect the share price.
     */
    function totalAssets() public view virtual override returns (uint256) {
        return totalSupply();
    }
}
