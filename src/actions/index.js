import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

export const loadWeb3 = () => dispatch => {
	const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
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
		const contract = getState().web3.connection.eth.Contract;
		return new contract(jsonInterface.abi, jsonInterface.networks[networkId].address);	

	} catch (error) {
		console.log(error);
		window.alert('Contract not deployed to current network. Please select another network with Metamask.');
		return null;
	}
}

export const loadToken = () => async (dispatch, getState) => {
	const token = await _loadContract(Token, getState);
	dispatch({
		type: 'LOAD_TOKEN',
		payload: token
	});
}

export const loadExchange = () => async (dispatch, getState) => {
	const exchange = await _loadContract(Exchange, getState);
	dispatch({
		type: 'LOAD_EXCHANGE',
		payload: exchange
	});
}
