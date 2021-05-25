import { BUY, ETHER_ADDRESS, toWei } from '../helpers';

export const showFillOrderModal = (formValues) => {
	return {
		type: 'SHOW_FILL_ORDER_MODAL',
		payload: formValues
	}
}
export const hideFillOrderModal = () => {
	return {
		type: 'HIDE_FILL_ORDER_MODAL'
	}
}

export const showCancelOrderModal = (order) => {
	return {
		type: 'SHOW_CANCEL_ORDER_MODAL',
		payload: order
	}
}

export const hideCancelOrderModal = (order) => {
	return {
		type: 'HIDE_CANCEL_ORDER_MODAL',
		payload: order
	}
}

export const showNewOrderModal = (newOrder) => {
	console.log(newOrder);
	return {
		type: 'SHOW_NEW_ORDER_MODAL',
		payload: newOrder
	}
}
export const hideNewOrderModal = () => {
	return {
		type: 'HIDE_NEW_ORDER_MODAL'
	}
}



export const getCancelledOrders = () => async (dispatch, getState) => {
	const cancelStream = await getState().contracts.exchange.getPastEvents('Cancel', { 
		fromBlock: 0, 
		toBlock: 'latest' 
	});
	dispatch({
		type: 'GET_CANCELLED_ORDERS',
		payload: cancelStream.map(order => order.returnValues)
	});
}

export const getTrades = () => async (dispatch, getState) => {
	const tradeStream = await getState().contracts.exchange.getPastEvents('Trade', { 
		fromBlock: 0, 
		toBlock: 'latest' 
	});
	dispatch({
		type: 'GET_TRADES',
		payload: tradeStream.map(order => order.returnValues)
	});
}

export const getAllOrders = () => async (dispatch, getState) => {
	const orderStream = await getState().contracts.exchange.getPastEvents('Order', { 
		fromBlock: 0, 
		toBlock: 'latest' 
	});
	dispatch({
		type: 'GET_ALL_ORDERS',
		payload: orderStream.map(order => order.returnValues)
	});
}

export const makeOrder = newOrder => (dispatch, getState) => {
	const { exchange, token } = getState().contracts;
	const { account } = getState().web3;
	let tokenGet, amountGet, tokenGive, amountGive;
	if(newOrder.orderType === BUY) {
		tokenGet = token.options.address;
		amountGet = toWei(newOrder.amount);
		tokenGive = ETHER_ADDRESS;
		amountGive = toWei(newOrder.subtotal);
	} else {
		tokenGet = ETHER_ADDRESS;
		amountGet = toWei(newOrder.subtotal);
		tokenGive = token.options.address;
		amountGive = toWei(newOrder.amount);
	}
	exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive)
		.send({ from: account })
		.on('transactionHash', hash => {
			dispatch({
				type: 'MAKING_ORDER'
			});
		})
		.on('error', error => handleError(error, dispatch));
}

const handleError = (error, dispatch) => {
	console.log(error);
	window.alert(error.message);
	dispatch({ type: 'REVERT_ORDER' });
}

export const fillOrder = order => (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	exchange.methods.fillOrder(order.id)
		.send({ from: account })
		.on('transactionHash', hash => {
			dispatch({
				type: 'FILLING_ORDER',
				payload: order.id
			});					
		})
		.on('error', error => handleError(error, dispatch));
}

export const cancelOrder = order => async (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	await exchange.methods.cancelOrder(order.id)
		.send({ from: account })
		.on('transactionHash', hash => {
			dispatch({
				type: 'CANCELLING_ORDER',
				payload: order.id
			});				
		})
		.on('error', error => handleError(error, dispatch));
}