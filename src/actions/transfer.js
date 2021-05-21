import { toWei } from '../helpers';

export const showTransferForm = (type, token) => {
	return {
		type: 'SHOW_TRANSFER_FORM',
		payload: {type, token}
	}
}

export const hideTransferForm = () => {
	return {
		type: 'HIDE_TRANSFER_FORM'
	}
}

export const showTransferModal = () => {
	return {
		type: 'SHOW_TRANSFER_MODAL'
	}
}

export const dismissTransferModal = () => dispatch => {
	dispatch({ type: 'HIDE_TRANSFER_FORM'});
	return {
		type: 'DISMISS_TRANSFER_MODAL'
	}
}

const handleError = (error, revertAction, dispatch) => {
	console.log(error);
	window.alert(error.message);
	dispatch({
		type: revertAction
	});
}

export const depositToken = (amount) => async (dispatch, getState) => {
	const { exchange, token } = getState().contracts;
	const { account } = getState().web3;
	dispatch({
		type: 'DEPOSIT_TOKEN',
		payload: amount
	});
	await token.methods.approve(exchange.options.address, toWei(amount))
		.send({ from: account })
		.on('transactionHash', async (hash) => {
			console.log('approved spender', amount)
			await exchange.methods.depositToken(token.options.address, toWei(amount))
				.send({ from: account })
				.on('transactionHash', (hash) => {
					// subscribe to Deposit event
					exchange.once('Deposit', {
						filter: { user: account }
					}, (error, event) => {
						console.log('RECEIVED Deposit event', event);
						dispatch({ type: 'BALANCES_LOADING' })
					})
				})
				.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));	
		})
		.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));
}

export const withdrawToken = (amount) => async (dispatch, getState) => {
	const { exchange, token } = getState().contracts;
	const { account } = getState().web3;
	console.log('withdrawToken action', amount);
	dispatch({
		type: 'WITHDRAW_TOKEN',
		payload: amount
	});
	await exchange.methods.withdrawToken(token.options.address, toWei(amount))
		.send({ from: account })
		.on('error', error => {
			console.log(error);
			window.alert(error.message);
			dispatch({
				type: 'REVERT_TRANSFER'
			});
		});
}
