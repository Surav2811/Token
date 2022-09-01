// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
// use latest solidity version at time of writing, need not worry about overflow and underflow
import 'hardhat/console.sol';
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
        console.log ('Owner balance is %s', balances[msg.sender]);
        console.log ('Trying to send the %s Pandacoins to %s.', _value,_to);
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
        require(_spender != address(0), 'The spender cannot be the Owner of the account');
        require(balances[msg.sender] >= _value, 'Insufficient Tokens');
        allowance[msg.sender][_spender] = _value;
        console.log ('The approved amount is %s', allowance[msg.sender][_spender]);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function approvedTransfer(address owner, address client, uint256 _value) external returns (bool) {
        require(msg.sender != address(0), 'The spender cannot be the Owner of the account');
        allowance[msg.sender][owner] = _value;

        console.log('The allowance amount is %s',allowance[owner][msg.sender]);
        console.log('The transaction amount is %s', _value);
        require( _value <= allowance[owner][msg.sender], 'Outside Allowance limit');
        _transfer(owner, client, _value );
        allowance [owner][msg.sender] -= _value;
        return true;
    }


    function allowedApprove (address spender) external view returns (uint) {
       return allowance[msg.sender][spender];
    }


    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        console.log('Account Balance : %s',balances[msg.sender]);
        require(_value <= balances[_from],'Not enough Tokens');
        require(_value <= allowance[_from][msg.sender],'Outside Allowance limit');
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - (_value);
        _transfer(_from, _to, _value);
        return true;
    }

    function allowedApproval (address _from) external view returns (uint) {
        return allowance[_from] [msg.sender];
    }

    function balanceOf (address account) external view returns (uint) {
        return balances[account];
    }
}
