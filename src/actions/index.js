import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import { ETHER_ADDRESS } from '../helpers';

export const loadBlockchainData = () => async dispatch => {
	if(typeof window.ethereum !== 'undefined') {
	  const web3 = new Web3(window.ethereum);
	  dispatch(setWeb3(web3));
	  await window.ethereum.enable();
	  web3.eth.getAccounts().then(async ( [account] ) => {
	  	dispatch(setAccount(account));
	    const networkId = await web3.eth.net.getId();
	    if(Token.networks[networkId] && Exchange.networks[networkId]) {
		    const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
		    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
		    dispatch(setToken(token));
		    dispatch(setExchange(exchange));    	
	    }
	  });	
	}
}

export const setWeb3 = (web3) => {
	return {
		type: 'SET_WEB3',
		payload: web3
	}
}

export const setAccount = (account) => {
	return {
		type: 'SET_ACCOUNT',
		payload: account
	};
}

export const setToken = (token) => {
	return {
		type: 'SET_TOKEN',
		payload: token
	}
}

export const setExchange = (exchange) => {
	return {
		type: 'SET_EXCHANGE',
		payload: exchange
	}
}

export const getBalances = () => async (dispatch, getState) => {
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













