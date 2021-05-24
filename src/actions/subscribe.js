import { getBalances } from './index';
import { find } from 'lodash';

export const subscribeToOrderEvents = () => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.events.Order({}, (error, event) => {
		if(orderIsUnique(event.returnValues.id, getState)) {
			dispatch({
				type: 'ORDER_MADE',
				payload: event.returnValues
			});			
			if(event.returnValues.user === account) {
				dispatch(getBalances());
				dispatch({ type: 'MY_ORDER_MADE' });
			}					
		}
	})
	.on('error', (error, receipt) => {
		console.log('ERROR', error, receipt);
	});
}
// how would I test this? 'it returns true if...'
const orderIsUnique = (id, getState) => {
	const allOrders = getState().orders.allOrders.data;
	if(find(allOrders, (o) => o.id === id) === undefined) return true;
}

export const subscribeToFillEvents = () => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.events.Trade({}, async (error, event) => {
		if(!orderIsFilled(event.returnValues.id, getState)) {
			dispatch({
				type: 'ORDER_FILLED',
				payload: event.returnValues
			});
			if(event.returnValues.user === account || event.returnValues.userFill === account) {
				dispatch(getBalances());
			}			
		}
	});
};

const orderIsFilled = (id, getState) => {
	const filledOrders = getState().orders.filledOrders.data;
	if(find(filledOrders, (o) => o.id === id) !== undefined) return true;
}

export const subscribeToCancelEvents = () => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.events.Cancel({}, (error, event) => {
		if(!orderIsCancelled(event.returnValues.id, getState)) {
			dispatch({
				type: 'ORDER_CANCELLED',
				payload: event.returnValues
			});	
			if(event.returnValues.user === account) {
				dispatch(getBalances());
			}
		}
	});
};

const orderIsCancelled = (id, getState) => {
	const cancelledOrders = getState().orders.cancelledOrders.data;
	if(find(cancelledOrders, (o) => o.id === id) !== undefined) return true;
}