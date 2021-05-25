import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import { ETHER_ADDRESS } from '../helpers';

export const loadBlockchainData = () => dispatch => {
	dispatch(loadAccount());
	dispatch(loadToken());
	dispatch(loadExchange());
}

export const loadWeb3 = () => dispatch => {
	//const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
	const web3 = new Web3(window.ethereum);
	console.log(web3);
	dispatch({
		type: 'LOAD_WEB3',
		payload: web3
	});
}

export const loadAccount = () => async (dispatch, getState) => {
	const [ account ] = await getState().web3.connection.eth.getAccounts();
	console.log(account);
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

export const getBalances = () => async (dispatch, getState) => {
	//dispatch({ type: 'BALANCES_LOADING' });
	const { account } = getState().web3;
	const { eth } = getState().web3.connection;
	const { token, exchange } = getState().contracts;
	
	const walletEtherBal = await eth.getBalance(account);
	const walletTokenBal = await token.methods.balanceOf(account).call();
	const exchangeEtherBal = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
	const exchangeTokenBal = await exchange.methods.balanceOf(token.options.address, account).call();
	dispatch({
		type: 'GET_BALANCES',
		payload: {
			walletEtherBal,
			walletTokenBal,
			exchangeEtherBal,
			exchangeTokenBal,
			loaded: true
		}
	});

}
/*
subscribe to Cancel, Order, Trade events in Content componentDidMount.
event callbacks fire action creators with ORDER_CANCELLED, ORDER_FILLED, ORDER_MADE events. Payload includes event.returnValues
orderReducer updates state with returnValues, check orderId and if it matches eventPending flag, reset eventPending to false.

cancelOrder - dispatch event with orderId as eventPending flag

UPDATE: use user address for myEventPending for ORDER_FILLED and ORDER_MADE. ORDER_FILLED could be another user filling the same
order, and ORDER_MADE, we don't have an order ID yet when initiating request.

*/












