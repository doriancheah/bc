const Token = artifacts.require('./Token')
import { tokens, EVM_REVERT } from './helpers'

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, receiver, exchange]) => {
	const name = 'DoryToken'
	const symbol = 'DORY'
	const decimals = '18'
	const totalSupply = tokens(1000000).toString()
	let token

	beforeEach(async () => {
		token = await Token.new()
	})

	describe('deployment', () => {
		
		it('tracks the name', async () => {
			const result = await token.name()
			result.should.equal(name)
		})

		it('tracks the symbol', async () => {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('tracks the decimals', async () => {
			const result = await token.decimals()
			result.toString().should.equal(decimals.toString())
		})

		it('tracks the total supply', async () => {
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply)
		})

		it('assigns the total supply to the deployer', async () => {
			const result = await token.balanceOf(deployer)
			result.toString().should.equal(totalSupply)
		})
	})

	describe('sending tokens', () => {
		let amount, result

		describe('success', () => {
			beforeEach(async () => {
				amount = tokens(100)
				result = await token.transfer(receiver, amount, { from: deployer })
			})

			it('updates token balances after transfer', async () => {
				const deployerBalance = await token.balanceOf(deployer)
				const receiverBalance = await token.balanceOf(receiver)
				deployerBalance.toString().should.equal(tokens(999900).toString())
				receiverBalance.toString().should.equal(tokens(100).toString())
			})

			it('emits a transfer event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Transfer')
				const event = log.args
				event.from.toString().should.eq(deployer, 'event.from is correct')
				event.to.toString().should.eq(receiver, 'event.to is correct')
				event.value.toString().should.eq(amount.toString(), 'event.value is correct')
			})			

			it('emits a transfer event when transfer value is 0', async () => {
				const zeroResult = await token.transfer(receiver, tokens(0), { from: deployer })
				const log = zeroResult.logs[0]
				log.event.should.eq('Transfer')
			})			
		})

		describe('failure', () => {
			it('throws if insufficient balance in sender account', async () => {
				let invalidAmount
				invalidAmount = tokens(1000001)
				await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

				invalidAmount = tokens(10)
				await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
			})
			it('rejects invalid recipient', async () => {
				await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
			})
		})
	})

	describe('approving tokens', () => {
		let result, amount

		beforeEach(async () => {
			amount = tokens(100)
			result = await token.approve(exchange, amount, { from: deployer })
		})

		describe('success', () => {
			it('allocates an allowance for delegated token spending', async () => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal(amount.toString())
			})
			it('emits an approval event', async () => {
				const log = result.logs[0]
				log.event.should.equal('Approval', 'event type is Approval')
				const event = log.args
				event.owner.toString().should.equal(deployer.toString(), 'owner is correct')
				event.spender.toString().should.equal(exchange.toString(), 'spender is correct')
				event.value.toString().should.equal(amount.toString(), 'amount is correct')
			})
		})

		describe('failure', () => {
			it('rejects an invalid spender address', async () => {
				await token.approve('0x0', amount, { from: deployer }).should.be.rejected
			})
		})
	})

// transferFrom
	describe('delegated transfer of tokens', () => {
		let amount, result
		beforeEach(async () => {
			amount = tokens(100)
			await token.approve(exchange, amount, { from: deployer })
		})

		describe('success', () => {
			beforeEach(async () => {
				amount = tokens(100)
				result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
			})

			it('updates token balances after transfer', async () => {
				const deployerBalance = await token.balanceOf(deployer)
				const receiverBalance = await token.balanceOf(receiver)
				deployerBalance.toString().should.equal(tokens(999900).toString())
				receiverBalance.toString().should.equal(tokens(100).toString())
			})

			it('decrements the allowance after transfer', async () => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal('0')
			})

			it('emits a transfer event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Transfer')
				const event = log.args
				event.from.toString().should.eq(deployer, 'event.from is correct')
				event.to.toString().should.eq(receiver, 'event.to is correct')
				event.value.toString().should.eq(amount.toString(), 'event.value is correct')
			})						
		})

		describe('failure', () => {
			it('rejects transfers exceeding allowance', async () => {
				await token.transferFrom(deployer, receiver, tokens(2000000), { from: exchange }).should.be.rejectedWith(EVM_REVERT)
			})

			it('rejects transfers to invalid address', async () => {
				await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
			})
		})

	})

})