const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

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

		// give some tokens to accounts[1]
		const sender = accounts[0];
		const receiver = accounts[1];
		let amount = web3.utils.toWei('10000', 'ether');

		await token.transfer(receiver, amount, { from: sender });
		console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`);

		// set up exchange users
		const user1 = accounts[0];
		const user2 = accounts[1];

	} catch(error) {
		console.log(error);
	}
	callback();
}