// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SC2SkinToken is ERC1155, AccessControl {
    using Strings for uint256;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    string public baseURI;
    
    constructor(string memory _baseURI) ERC1155(_baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        baseURI = _baseURI;
    }
    
    function mintSkin(address to, uint256 skinId, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        _mint(to, skinId, amount, "");
    }
    
    function burnSkin(address from, uint256 skinId, uint256 amount) 
        external 
        onlyRole(BURNER_ROLE) 
    {
        _burn(from, skinId, amount);
    }
    
    function uri(uint256 skinId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, skinId.toString()));
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function setBaseURI(string memory _baseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _baseURI;
    }
}