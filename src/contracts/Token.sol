pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Token {
	using SafeMath for uint;

	string public name = 'DoryToken';
	string public symbol = 'DORY';
	uint256 public decimals = 18;
	uint256 public totalSupply;

	event Transfer(address indexed from, address indexed to, uint256 value); // indexed allows you to filter when subscribing

	// track balances
	mapping(address => uint256) public balanceOf; // public modifier exposes a function that returns a balance

	// constructor runs only once on deployment, therefore msg.sender is the deployer.
	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
		balanceOf[msg.sender] = totalSupply;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
}