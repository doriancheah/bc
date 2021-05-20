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


		// fetch accounts from wallet - these are unlocked
		const accounts = await web3.eth.getAccounts();

		// fetch the deployed token
		const token = await Token.deployed();
		const exchange = await Exchange.deployed();

		const [ user1, user2, user3, user4 ] = accounts;
		const showBalances = async () => {
			let user1DoryBal, user1EthBal, user2DoryBal, user2EthBal;

			user1DoryBal = await exchange.balanceOf(token.address, user1);
			console.log('user1 address', user1);
			console.log('user1 DORY, raw to string', user1DoryBal.toString());
			console.log('user1 DORY, fromWei', web3.utils.fromWei(user1DoryBal));

			user2DoryBal = await exchange.balanceOf(token.address, user2);
			console.log('user2 address', user2);
			console.log('user2 DORY, raw to string', user2DoryBal.toString());
			console.log('user2 DORY, fromWei', web3.utils.fromWei(user2DoryBal));

			user1EthBal = await exchange.balanceOf(ETHER_ADDRESS, user1);
			console.log('user1 address', user1);
			console.log('user1 Eth, raw to string', user1EthBal.toString());
			console.log('user1 Eth, fromWei', web3.utils.fromWei(user1EthBal));

			user2EthBal = await exchange.balanceOf(ETHER_ADDRESS, user2);
			console.log('user2 address', user2);
			console.log('user2 Eth, raw to string', user2EthBal.toString());
			console.log('user2 Eth, fromWei', web3.utils.fromWei(user2EthBal));
		}

		showBalances();

		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(1), { from: user1 });
		console.log('user1 buy order, 100 tokens');
		// wait 1 second
		await wait(1);
		// user2 fills order
		orderId = result.logs[0].args.id;
		await exchange.fillOrder(orderId, { from: user2 });
		console.log('user2 fills order, sells 100 tokens for 1 ether');

		showBalances();




	} catch(error) {
		console.log(error);
	}
	callback();
}