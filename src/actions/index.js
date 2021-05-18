import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

export const loadWeb3 = () => dispatch => {
	//const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
	const web3 = new Web3(window.ethereum);
	dispatch({
		type: 'LOAD_WEB3',
		payload: web3
	});
}

export const loadAccount = () => async (dispatch, getState) => {
	const [ account ] = await getState().web3.connection.eth.getAccounts();
	dispatch({
		type: 'LOAD_ACCOUNT',
		payload: account
	});
}

const _loadContract = async (jsonInterface, getState) => {
	try {		
		const networkId = await getState().web3.connection.eth.net.getId();
		const Contract = getState().web3.connection.eth.Contract;
		return new Contract(jsonInterface.abi, jsonInterface.networks[networkId].address);	

	} catch (error) {
		console.log(error);
		return null;
	}
}

export const loadToken = () => async (dispatch, getState) => {
	const token = await _loadContract(Token, getState);
	if (token) {
		dispatch({
			type: 'LOAD_TOKEN',
			payload: token
		});		
	}
}

export const loadExchange = () => async (dispatch, getState) => {
	const exchange = await _loadContract(Exchange, getState);
	if (exchange) {
		dispatch({
			type: 'LOAD_EXCHANGE',
			payload: exchange
		});		
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
