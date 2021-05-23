import { getBalances } from './index';

export const subscribeToOrderEvents = () => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.events.Order({}, (error, event) => {
		if(error) {
			window.alert('error in Order event subscriber');
			console.log(error);
			return;
		}
		console.log('event.returnValues', event.returnValues);
		dispatch({
			type: 'ORDER_MADE',
			payload: event.returnValues
		});
		
		if(event.returnValues.user === account) {
			dispatch(getBalances());
		}
	});
}

export const subscribeToFillEvents = () => (dispatch, getState) => {
	const { exchange } = getState().contracts;
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
	const { account } = getState().web3;
	exchange.events.Cancel({}, (error, event) => {
		// TODO: handle errors
		console.log('event.returnValues', event.returnValues);
		dispatch({
			type: 'ORDER_CANCELLED',
			payload: event.returnValues
		});	
		if(event.returnValues.user === account) {
			dispatch(getBalances());
		}

	});
};