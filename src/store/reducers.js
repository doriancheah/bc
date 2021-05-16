import { combineReducers } from 'redux';

// WEB3 CONNECT action would instantiate web3 and pass the object in the payload.

const web3Reducer = (state = {}, action) => {
	switch (action.type) {
		case 'WEB3_LOADED':
			return { ...state, connection: action.connection };
		case 'WEB3_ACCOUNT_LOADED':
			return { ...state, account: action.account };
		default: 
			return state;
	}
}

const tokenReducer = (state = {}, action) => {
	switch (action.type) {
		case 'TOKEN_LOADED':
			return { ...state, contract: action.contract };
		default:
			return state;
	}
}

const exchangeReducer = (state = {}, action) => {
	switch (action.type) {
		case 'EXCHANGE_LOADED':
			return { ...state, contract: action.contract };
		default:
			return state;
	}
}
const rootReducer = combineReducers({
	web3: web3Reducer,
	token: tokenReducer,
	exchange: exchangeReducer
});


export default rootReducer;