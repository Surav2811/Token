// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
// use latest solidity version at time of writing, need not worry about overflow and underflow

/// @title ERC20 Contract 

contract Pandacoin {

    // My Variables
    string public name = 'Pandacoin';
    string public symbol = 'PDC';
    uint256 public decimals;
    uint256 public totalSupply = 1000000;
    address public admin;

    // Keep track balances and allowances approved
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events - fire events on state changes etc
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balances[msg.sender] = totalSupply;
        admin = msg.sender;
    }

    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(balances[msg.sender] >= _value, 'Not enough Tokens');
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        // Ensure sending is to valid address! 0x0 address can be used to burn() 
        require(_to != address(0));
        balances[_from] = balances[_from] - (_value);
        balances[_to] = balances[_to] + (_value);
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(_value <= balances[_from]);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - (_value);
        _transfer(_from, _to, _value);
        return true;
    }

    function balanceOf (address account) external view returns (uint) {
        return balances[account];
    }
}
