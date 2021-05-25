import { toWei } from '../helpers';
import { getBalances } from './index';

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

export const depositToken = amount => (dispatch, getState) => {
	const { exchange, token } = getState().contracts;
	const { account } = getState().web3;
	token.methods.approve(exchange.options.address, toWei(amount))
		.send({ from: account })
		.on('transactionHash', hash => {
			exchange.methods.depositToken(token.options.address, toWei(amount))
				.send({ from: account })
				.on('transactionHash', hash => {
					// after contract call and before subscribe...
					dispatch({ type: 'TRANSFER_PENDING'})
					exchange.once('Deposit', {
						filter: { user: account }
					}, (error, event) => {
						dispatch(getBalances());
						dispatch({ type: 'TRANSFER_COMPLETE'})
					})
				})
				.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));	
		})
		.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));
}

export const withdrawToken = amount => (dispatch, getState) => {
	const { exchange, token } = getState().contracts;
	const { account } = getState().web3;
	exchange.methods.withdrawToken(token.options.address, toWei(amount))
		.send({ from: account })
		.on('transactionHash', hash => {
			exchange.once('Withdrawal', {
				filter: { user: account }
			}, (error, event) => {
				dispatch(getBalances());
			})
		})
		.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));
}

export const depositEther = amount => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.methods.depositEther()
		.send({ from: account, value: toWei(amount) })
		.on('transactionHash', hash => {
			exchange.once('Deposit', {
				filter: { user: account }
			}, (error, event) => {
				dispatch(getBalances())
			})
		})
		.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));
}

export const withdrawEther = amount => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.methods.withdrawEther(toWei(amount))
		.send({ from: account })
		.on('transactionHash', hash => {
			exchange.once('Withdrawal', {
				filter: { user: account }
			}, (error, event) => {
				dispatch(getBalances())
			})
		})
		.on('error', error => handleError(error, 'REVERT_TRANSFER', dispatch));	
}