import { combineReducers } from 'redux';

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
			return { ...state, token: action.payload };
		case 'LOAD_EXCHANGE':
			return { ...state, exchange: action.payload };
		default:
			return state;		
	}	
}

export default combineReducers({
	web3: web3Reducer,
	contracts: contractReducer
});