import { tokens, ether, eventShould, EVM_REVERT, ETHER_ADDRESS } from './helpers'
// import the contract we are testing.
const Exchange = artifacts.require('Exchange')
const Token = artifacts.require('Token')

require('chai')
	.use(require('chai-as-promised'))
	.should()

/*const eventShould = (log, eventType, props) => {
	log.event.should.equal(eventType, `event type is ${eventType}`)
	Object.keys(props).map((key) => {
		log.args[key].toString().should.equal(props[key].toString(), `${key} is invalid`)
		console.log(log.args[key].toString(), props[key].toString(), `${key} is invalid`)
	})
}*/

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
	let token, exchange
	const feePercent = 10

	beforeEach(async () => {
		// deploy token
		token = await Token.new()
		// transfer 100 tokens each to user1, user2
		await token.transfer(user1, tokens(100), { from: deployer })
		await token.transfer(user2, tokens(100), { from: deployer })

		// deploy exchange
		exchange = await Exchange.new(feeAccount, feePercent)
	})

	describe('deployment', () => {
		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})
		it('tracks the fee percent', async () => {
			const result = await exchange.feePercent()
			result.toString().should.equal(feePercent.toString())
		})
	})

	describe('fallback', () => {
		it('reverts when Ether is sent', async () => {
			await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT)
		})
	})

	describe('depositing ether', () => {
		let result, amount
		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({ from: user1, value: ether(1) })
		})

		it('updates ether balance for user in tokens mapping', async () => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		})

		it('emits a Deposit event', async () => {
			const log = result.logs[0]
			eventShould(log, 'Deposit', {
				token: ETHER_ADDRESS,
				user: user1,
				amount: amount,
				balance: amount
			})
		})
	})

	describe('withdrawing ether', () => {
		let result, amount
		amount = ether(1)
		beforeEach(async () => {
			result = await exchange.depositEther({ from: user1, value: amount })
		})
		describe('success', () => {
			beforeEach(async () => {
				result = await exchange.withdrawEther(amount, { from: user1 })
			})
			it('withdraws Ether funds', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.equal('0')
			})
			it('emits a Withdrawal event', async () => {
				const log = result.logs[0]
				eventShould(log, 'Withdrawal', {
					token: ETHER_ADDRESS,
					user: user1,
					amount: amount,
					balance: 0
				})
			})
		})
		describe('failure', () => {
			it('rejects withdrawal request greater than balance', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				await exchange.withdrawEther(balance + 1, { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('deposit tokens', () => {
		describe('success', () => {
			let result, amount
			beforeEach(async () => {
				amount = tokens(10)
				
				await token.approve(exchange.address, amount, { from: user1 })
				result = await exchange.depositToken(token.address, amount, { from: user1 })
			})

			it('tracks the token deposit', async () => {
				let balance
				balance = await token.balanceOf(exchange.address)
				balance.toString().should.equal(amount.toString())
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal(amount.toString())
			})
			it('emits a Deposit event', async () => {
				const log = result.logs[0]
				
				eventShould(log, 'Deposit', {
					user: user1,
					token: token.address,
					amount: amount,
					balance: amount
				})
			})
		})
		describe('failure', () => {
			beforeEach(async () => {
				await token.approve(exchange.address, tokens(10), { from: user2 })
			})
			it('fails on insufficient token approval', async () => {
				await exchange.depositToken(token.address, tokens(20), { from: user2 }).should.be.rejectedWith(EVM_REVERT)
			})
			it('rejects ETH deposits', async () => {
				await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('withdraw tokens', () => {
		let amount = tokens(100)
		beforeEach(async () => {
			// user approve and deposit tokens
			await token.approve(exchange.address, amount, { from: user1 })
			await exchange.depositToken(token.address, amount, { from: user1 })
		})

		describe('success', () => {
			let result
			beforeEach(async () => {
				// withdraw tokens and save result
				result = await exchange.withdrawToken(token.address, amount, { from: user1 })
			})
			it('tracks token balances', async () => {
				const balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal('0')
			})
			it('emits a withdrawal event', async () => {
				const log = result.logs[0]
				eventShould(log, 'Withdrawal', {
					token: token.address,
					user: user1,
					amount: amount,
					balance: 0
				})
			})
		})

		describe('failure', () => {
			it('rejects attempt to withdraw Ether', async () => {
				await exchange.withdrawToken(ETHER_ADDRESS, ether(1), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
			it('rejects token withdrawal exceeding user balance', async () => {
				await exchange.withdrawToken(token.address, amount + 1, { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('check balances', () => {
		let result, tokenAmount, ethAmount
		tokenAmount = tokens(10)
		ethAmount = ether(1)

		beforeEach(async () => {
			// user deposits some ETH and DORY
			await token.approve(exchange.address, tokenAmount, { from: user1 })
			await exchange.depositToken(token.address, tokenAmount, { from: user1 })
			await exchange.depositEther({ from: user1, value: ethAmount })
		})
		it('returns accurate token balance', async () => {
			result = await exchange.balanceOf(token.address, user1, { from: user1 })
			result.toString().should.equal(tokenAmount.toString())
		})
		it('returns accurate Ether balance', async () => {
			result = await exchange.balanceOf(ETHER_ADDRESS, user1, { from: user1 })
			result.toString().should.equal(ethAmount.toString())
		})
	})





})