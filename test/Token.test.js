const Token = artifacts.require('./Token')
import { tokens } from './helpers'

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, sender, receiver]) => {
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
		})

		describe('failure', () => {
			it('throws if insufficient balance in sender account', async () => {
				let invalidAmount
				invalidAmount = tokens(1000001)
				await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith('VM Exception while processing transaction: revert');
			})
		})
	})
})