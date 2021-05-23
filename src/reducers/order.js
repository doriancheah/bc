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
		case 'CANCEL_ORDER':
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
		case 'ORDER_MADE':
			return { ...state, 
				allOrders: { 
					...state.allOrders,
					data: [...state.allOrders.data, action.payload]
				}
			};
		case 'ORDER_CANCELLED':
			// TO DO: use account address as myEventPending, because...
			// REALLY what we need to do is check if the event returnValues contain a user matching this account
			// because a matching order Id in the case of ORDER_FILLED doesn't mean it's our event
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
		default:
			return state;
	}
}