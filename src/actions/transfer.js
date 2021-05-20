export const showWithdrawEth = () => {
	return {
		type: 'SHOW_WITHDRAW_ETH',
	}
}

export const showWithdrawDory = () => {
	return {
		type: 'SHOW_WITHDRAW_DORY',
	}
}

export const showDepositEth = () => {
	return {
		type: 'SHOW_DEPOSIT_ETH',
	}
}

export const showDepositDory = () => {
	return {
		type: 'SHOW_DEPOSIT_DORY',
	}
}

export const showTransferForm = (type, token) => {
	return {
		type: 'SHOW_TRANSFER_FORM',
		payload: {type, token}
	}
}