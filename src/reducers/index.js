import { combineReducers } from 'redux';
import { mapKeys } from 'lodash';

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

const orderReducer = (state = {}, action) => {
	switch (action.type) {
		case 'GET_CANCELLED_ORDERS':
			return { ...state, cancelledOrders: { loaded: true, data: mapKeys(action.payload, 'id') }};
		case 'GET_TRADES':
			return { ...state, filledOrders: { loaded: true, data: action.payload }};
		case 'GET_ALL_ORDERS':
			return { ...state, allOrders: { loaded: true, data: mapKeys(action.payload, 'id') }};
		default:
			return state;
	}
}

export default combineReducers({
	web3: web3Reducer,
	contracts: contractReducer,
	orders: orderReducer
});