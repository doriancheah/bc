pragma solidity ^0.5.0;
import './Token.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Exchange {
	using SafeMath for uint;

	// STATE VARIABLES
	address public feeAccount;	// account receiving exchange fees
	uint256 public feePercent;
	address constant ETHER = address(0); // store Ether in tokens mapping with blank address

	/* by mapping tokens to users rather than users to tokens, we could more easily see total
	amount of any token currently on the exchange...? */ 
	mapping(address => mapping(address => uint256)) public tokens;

	// EVENTS
	event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event Withdrawal(address indexed token, address indexed user, uint256 amount, uint256 balance);

	constructor(address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

/*	function () external {
		revert;
	}
*/
	function depositEther() payable public {
		//msg.value
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint256 _amount) public {
		require(tokens[ETHER][msg.sender] >= _amount);
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
		msg.sender.transfer(_amount); // here
		emit Withdrawal(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);

	}

	function depositToken(address _token, uint256 _amount) public {
		require(_token != ETHER);		// TODO: write test to see if this is necessary.
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));

		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function withdrawToken(address _token, uint256 _amount) public {
		require(_token != ETHER);
		require(tokens[_token][msg.sender] >= _amount);
		tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
		Token(_token).transfer(msg.sender, _amount);
		emit Withdrawal(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user) public view returns (uint256 balance) {
		return tokens[_token][_user];
	}
}

// deposit and withdraw funds
// manage orders - make and cancel
// handle trades - charge fees

/*
- set the fee account
- deposit ether
- withdraw ether
- deposit tokens
- withdraw tokens
- chack balances
- make order
- cancel order
- fill order
- charge fees
*/

