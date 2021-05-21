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

export const fillOrder = order => async (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	dispatch({
		type: 'FILL_ORDER',
		payload: order.id
	});
	await exchange.methods.fillOrder(order.id)
		.send({ from: account })
		.on('error', error => {
			console.log(error);
			window.alert(error.message);
			dispatch({
				type: 'REVERT_ORDER'
			});
		});
}

export const cancelOrder = order => async (dispatch, getState) => {
	const { exchange } = getState().contracts;
	const { account } = getState().web3;
	dispatch({
		type: 'CANCEL_ORDER',
		payload: order.id
	});	
	await exchange.methods.cancelOrder(order.id)
		.send({ from: account })
		.on('error', error => {
			window.alert(error.message);
			dispatch({
				type: 'REVERT_ORDER'
			})
		});
}