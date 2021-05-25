import { combineReducers } from 'redux';
import { orderReducer } from './order';
import { formsReducer } from './forms';
import { reducer as formReducer } from 'redux-form';

const web3Reducer = (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_WEB3':
			return { ...state, connection: action.payload };
		case 'LOAD_ACCOUNT':
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
		case 'BALANCES_LOADING':
			return { ...state, loaded: false };
		case 'GET_BALANCES':
			return { ...state, ...action.payload };
		case 'TRANSFER_PENDING':
			return { ...state, transferPending: true };
		case 'TRANSFER_COMPLETE':
			return { ...state, transferPending: false };
		default:
			return state;
	}
}

export default combineReducers({
	web3: web3Reducer,
	contracts: contractReducer,
	balances: balanceReducer,
	orders: orderReducer,
	forms: formsReducer,
	form: formReducer
});