export const ether = n => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))

export const tokens = n => ether(n)

export const EVM_REVERT = 'VM Exception while processing transaction: revert'
export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

export const eventShould = (log, eventType, props) => {
	log.event.should.equal(eventType, `event type is ${eventType}`)
	Object.keys(props).map((key) => {
		if(typeof props[key] === 'function') {
			props[key]()
		} else {
			log.args[key].toString().should.equal(props[key].toString(), `${key} is invalid`)	
		}
	})
}