export const orderReducer = (state = {}, action) => {
		let myEventPending;
	switch (action.type) {
		case 'GET_CANCELLED_ORDERS':
			return { ...state, cancelledOrders: { loaded: true, data: action.payload }};
		case 'GET_TRADES':
			return { ...state, filledOrders: { loaded: true, data: action.payload }};
		case 'GET_ALL_ORDERS':
			return { ...state, allOrders: { loaded: true, data: action.payload }};
		case 'FILL_ORDER':
			return { ...state, myEventPending: action.payload };
		case 'ORDER_FILLED':
			myEventPending = action.payload.id === state.myEventPending ? false : state.myEventPending;
			return { ...state,
				myEventPending,
				filledOrders: {
					loaded: true,
					data: [ ...state.filledOrders.data, action.payload ]	
				}
			};			
		case 'CANCEL_ORDER':
			return { ...state, myEventPending: action.payload };
		case 'ORDER_CANCELLED':
			// if user-initiated cancellation is pending and this cancel event is the 
			// result of a different cancellation, leave the myEventPending flag intact.
			// if it's the result of our cancellation, set the flag to false to remove 
			// spinner from MyTransaction component
			myEventPending = action.payload.id === state.myEventPending ? false : state.myEventPending;
			return { ...state,
				myEventPending,
				cancelledOrders: {
					loaded: true,
					data: [ ...state.cancelledOrders.data, action.payload ]	
				}
			};
		case 'REVERT_ORDER':
			return { ...state, myEventPending: false };
		case 'MAKE_ORDER':
			return { ...state, 
				allOrders: { 
					...state.allOrders,
					data: [...state.allOrders.data, action.payload]
				}
			};
		default:
			return state;
	}
}