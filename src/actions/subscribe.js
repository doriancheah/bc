import { ETHER_ADDRESS } from '../helpers';

export const subscribeToFillEvents = () => (dispatch, getState) => {
	const { exchange, token } = getState().contracts;
	const { account } = getState().web3;
	exchange.events.Trade({}, async (error, event) => {
		if(error) {
			window.alert('error in Trade event subscriber');
			console.log(error);
			return;
		}
		console.log('event.returnValues', event.returnValues);
		dispatch({
			type: 'ORDER_FILLED',
			payload: event.returnValues
		});

		if(event.returnValues.user === account || event.returnValues.userFill === account) {
			const { account } = getState().web3;
			const { exchange } = getState().contracts;
			const exchangeEtherBal = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
			const exchangeTokenBal = await exchange.methods.balanceOf(token.options.address, account).call();
			dispatch({
				type: 'GET_BALANCES',
				payload: { exchangeEtherBal, exchangeTokenBal}
			});
		}
	});
};

export const subscribeToCancelEvents = () => (dispatch, getState) => {
	const { exchange } = getState().contracts;

	exchange.events.Cancel({}, (error, event) => {
		// TODO: handle errors
		console.log('event.returnValues', event.returnValues);
		dispatch({
			type: 'ORDER_CANCELLED',
			payload: event.returnValues
		});	
	});
};

// when certain events arrive that affect the user's balance, we need to fetch new balances from chain and dispatch the GET_BALANCES action.