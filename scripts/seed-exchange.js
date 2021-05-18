const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

// helpers
const ether = n => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
const tokens = n => ether(n);
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const wait = (seconds) => {
	const milliseconds = seconds * 1000;
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = async function(callback) {

	try {
		console.log('script running...');

		// fetch accounts from wallet - these are unlocked
		const accounts = await web3.eth.getAccounts();

		// fetch the deployed token
		const token = await Token.deployed();
		console.log('Token fetched', token.address);

		// fetch the deployed exchange
		const exchange = await Exchange.deployed();
		console.log('Exchange fetched', exchange.address);

		// give some tokens to accounts
		const [ user1, user2, user3, user4 ] = accounts;

		let amount = web3.utils.toWei('10000', 'ether');

		await token.transfer(user2, amount, { from: user1 });
		console.log(`Transferred ${amount} tokens from ${user1} to ${user2}`);

		await token.transfer(user3, amount, { from: user1 });
		console.log(`Transferred ${amount} tokens from ${user1} to ${user3}`);

		await token.transfer(user4, amount, { from: user1 });
		console.log(`Transferred ${amount} tokens from ${user1} to ${user4}`);

		// users deposits ether
		amount = 1;
		await exchange.depositEther({ from: user1, value: ether(amount) });
		console.log(`Deposited ${amount} Ether from ${user1}`)

		await exchange.depositEther({ from: user2, value: ether(amount) });
		console.log(`Deposited ${amount} Ether from ${user2}`)

		await exchange.depositEther({ from: user3, value: ether(amount) });
		console.log(`Deposited ${amount} Ether from ${user3}`)

		await exchange.depositEther({ from: user4, value: ether(amount) });
		console.log(`Deposited ${amount} Ether from ${user4}`)

		// user2 approves tokens
		amount = 10000;
		await token.approve(exchange.address, tokens(amount), { from: user2 });
		console.log(`Approved ${amount} tokens from ${user2}`);

		// user2 deposits tokens
		await exchange.depositToken(token.address, tokens(amount), { from: user2 });
		console.log(`Deposited ${amount} tokens from ${user2}`);

		// user3 approves tokens
		amount = 10000;
		await token.approve(exchange.address, tokens(amount), { from: user3 });
		console.log(`Approved ${amount} tokens from ${user3}`);

		// user3 deposits tokens
		await exchange.depositToken(token.address, tokens(amount), { from: user3 });
		console.log(`Deposited ${amount} tokens from ${user3}`);
		// seed a cancelled order ---------------------------------------------------
		//

		// user1 makes order to get tokens
		let result, orderId
		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
		console.log(`Made order from ${user1}`);

		// user1 cancels order
		orderId = result.logs[0].args.id;
		await exchange.cancelOrder(orderId, { from: user1 });
		console.log(`Cancelled order ${orderId} from ${user1}`); 

		// seed filled orders --------------------------------------------------------
		//

		// user1 makes order
		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
		console.log(`Made order from ${user1}`);

		// user2 fills order
		orderId = result.logs[0].args.id;
		await exchange.fillOrder(orderId, { from: user2 });
		console.log(`Filled order ${orderId} from ${user2}`);

		// wait 1 second
		await wait(1);

		// user1 makes another order
		result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 });
		console.log(`Made order from ${user1}`);

		// user2 fills another order
		orderId = result.logs[0].args.id;
		await exchange.fillOrder(orderId, { from: user2 });
		console.log(`Filled order ${orderId} from ${user2}`);

		// wait 1 second
		await wait(1);

		// user1 makes final order
		result = await exchange.makeOrder(token.address, tokens(200), ETHER_ADDRESS, ether(0.15), { from: user1 });
		console.log(`Made order from ${user1}`);

		// user2 fills final order
		orderId = result.logs[0].args.id;
		await exchange.fillOrder(orderId, { from: user2 });
		console.log(`Filled order ${orderId} from ${user2}`);

		await wait(1);

		// user2 MAKES order
		result = await exchange.makeOrder(token.address, tokens(75), ETHER_ADDRESS, ether(0.025), { from: user2 });
		console.log(`Made order from ${user2}`);
		// user3 fills order
		orderId = result.logs[0].args.id;
		await exchange.fillOrder(orderId, { from: user3 });
		console.log(`Filled order ${orderId} from ${user3}`);

		await wait(1);

		// user4 MAKES order
		result = await exchange.makeOrder(token.address, tokens(120), ETHER_ADDRESS, ether(0.035), { from: user4 });
		console.log(`Made order from ${user4}`);
		// user3 fills order
		orderId = result.logs[0].args.id;
		await exchange.fillOrder(orderId, { from: user3 });
		console.log(`Filled order ${orderId} from ${user3}`);

		await wait(1);



		// SEED OPEN ORDERS -----------------------------------------------------------------
		//
		// user1 makes 10 orders
		for(let i = 1; i <= 10; i++) {
			result = await exchange.makeOrder(token.address, tokens(i * 10), ETHER_ADDRESS, ether(0.01), { from: user1 });
			console.log(`Made order for ${i * 10} tokens from ${user1}`);
			// wait 1 second
			await wait(1);
		}
		// user2 makes 10 orders
		for(let i = 1; i <= 10; i++) {
			result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(i * 10), { from: user2 });
			console.log(`Made order from ${user2}`);
			// wait 1 second
			await wait(1);
		}
	} catch(error) {
		console.log(error);
	}
	callback();
}