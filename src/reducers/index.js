import { combineReducers } from 'redux';
import { orderReducer } from './order';
import { transferReducer } from './transfer';
//import { mapKeys } from 'lodash';

const web3Reducer = (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_WEB3':
			return { ...state, connection: action.payload };
		case 'LOAD_ACCOUNT':
			return { ...state, account: action.payload };
		case 'SWITCH_ACCOUNT':
			return { ...state, account: action.payload };
		default:
			return state;		
	}	
}

const contractReducer = (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_TOKEN':
			return { ...state, token: action.payload, tokenLoaded: true };
		case 'LOAD_EXCHANGE':
			return { ...state, exchange: action.payload, exchangeLoaded: true };
		default:
			return state;		
	}	
}

const balanceReducer = (state = {}, action) => {
	switch (action.type) {
		case 'GET_BALANCES':
			return { ...state, ...action.payload };
		default:
			return state;
	}
}



export default combineReducers({
	web3: web3Reducer,
	contracts: contractReducer,
	balances: balanceReducer,
	orders: orderReducer,
	transfers: transferReducer
});