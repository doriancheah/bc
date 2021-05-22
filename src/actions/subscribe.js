import { ETHER_ADDRESS } from '../helpers';
import { getBalances } from './index';

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
			dispatch(getBalances());
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