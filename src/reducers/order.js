import { find, indexOf } from 'lodash';

const updateOrdersWithPending = (orders, id) => {
	const order = find(orders, o => o.id === id);
	const pendingOrder = {...order, pending: true}; // copy object
	const index = indexOf(orders, order);
	const ordersWithPending = [...orders]; // copy array
	ordersWithPending.splice(index, 1, pendingOrder); // splice in edited object
	return ordersWithPending;
}

export const orderReducer = (state = {}, action) => {
	switch (action.type) {
		case 'GET_CANCELLED_ORDERS':
			return { ...state, cancelledOrders: { loaded: true, data: action.payload }};
		case 'GET_TRADES':
			return { ...state, filledOrders: { loaded: true, data: action.payload }};
		case 'GET_ALL_ORDERS':
			return { ...state, allOrders: { loaded: true, data: action.payload }};
		case 'FILLING_ORDER':
			// add pending:true to order object
			return { 
				...state, 
				allOrders: { 
					loaded: true, 
					data: updateOrdersWithPending(state.allOrders.data, action.payload)
				}
			};
		case 'CANCELLING_ORDER':
			// add pending:true to order object
			return { 
				...state, 
				allOrders: { 
					loaded: true, 
					data: updateOrdersWithPending(state.allOrders.data, action.payload)
				}
			};
		case 'MAKING_ORDER':
			return { ...state, makingOrder: true }
		case 'ORDER_FILLED':
			return { 
				...state,
				filledOrders: {
					loaded: true,
					data: [ ...state.filledOrders.data, action.payload ]	
				}
			};			
		case 'ORDER_MADE':
			return { 
				...state, 
				allOrders: { 
					...state.allOrders,
					data: [...state.allOrders.data, action.payload]
				}
			};
		case 'MY_ORDER_MADE':
			return { ...state, makingOrder: false }
			
		case 'ORDER_CANCELLED':
			return { 
				...state,
				cancelledOrders: {
					loaded: true,
					data: [ ...state.cancelledOrders.data, action.payload ]	
				}
			};
		case 'REVERT_ORDER':
			return { ...state, myEventPending: false };
		default:
			return state;
	}
}