pragma solidity ^0.5.0;
import './Token.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Exchange {
	using SafeMath for uint;

	// STATE VARIABLES ================================================================================
	address public feeAccount;	// account receiving exchange fees
	uint256 public feePercent;
	address constant ETHER = address(0); // store Ether in tokens mapping with blank address

	/* by mapping tokens to users rather than users to tokens, we could more easily see total
	amount of any token currently on the exchange...? */ 
	mapping(address => mapping(address => uint256)) public tokens;
	mapping(uint256 => _Order) public orders;
	mapping(uint256 => bool) public orderFilled;
	mapping(uint256 => bool) public orderCancelled;
	uint256 public orderCount;

	// EVENTS ==========================================================================================
	event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event Withdrawal(address indexed token, address indexed user, uint256 amount, uint256 balance);
	event Order(
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timestamp	
	);
	event Cancel(
		uint256 indexed id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timestamp	
	);
	event Trade(
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		address userFill,
		uint256 timestamp	
	);
	// STRUCTS ==========================================================================================
	struct _Order {
		uint256 id;
		address user;
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timestamp;
	}

	// METHODS ==========================================================================================

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
		//require(tokens[ETHER][msg.sender] >= _amount);
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
		//require(tokens[_token][msg.sender] >= _amount);		// SafeMath makes this unnecessary
		tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
		Token(_token).transfer(msg.sender, _amount);
		emit Withdrawal(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user) public view returns (uint256 balance) {
		return tokens[_token][_user];
	}

	function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
		orderCount = orderCount.add(1);
		orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
		emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
	}

	function cancelOrder(uint256 _id) public {
		_Order storage _order = orders[_id];

		require(address(_order.user) == msg.sender);
		require(_order.id == _id);		// if _id not present in orders mapping, solidity returns blank struct, default value of id = 0

		orderCancelled[_id] = true;
		emit Cancel(_id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, now);
	}

	function fillOrder(uint256 _id) public {
		require(_id > 0 && _id <= orderCount);
		require(!orderFilled[_id], 'Order already filled.');
		require(!orderCancelled[_id], 'Order already cancelled.');
		// TODO: make sure both users have sufficient balances (NOPE, using SafeMath makes this unneccesary)

		_Order storage _order = orders[_id];
		_trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
		orderFilled[_order.id] = true;

		// fetch the order
		// mark order as filled
	}

	function _trade(uint256 _orderId, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {

		// fee based on _amountGet (paid by order filler on top of the amount fulfilled)
		uint256 _feeAmount = _amountGet.mul(feePercent).div(100); 
		// debit tokenGet plus fee from order filler's account 
		tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount));
		// credit tokenGet to order placer's account
		tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
		// credit FEE in tokenGet to feeAccount
		tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(_feeAmount);
		// debit tokenGive from order placer's account
		tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
		// credit tokenGive to order filler's account
		tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);

		emit Trade(_orderId, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, now);
		


		// emit Trade event
	}
}

// deposit and withdraw funds
// manage orders - make and cancel
// handle trades - charge fees

/*
[X] set the fee account
[X] deposit ether
[X] withdraw ether
[X] deposit tokens
[X] withdraw tokens
[X] chack balances
[X] make order
[ ] cancel order
[ ] fill order
[ ] charge fees
*/

