/*
This one manages state that is used to determine when to show various forms to get user input or confirmation
Transfer Form to deposit/withdraw assets from exchange
Transfer Modal to confirm transfer
Create Order Form to make an order
Fill Order Modal to confirm filling
Cancel Order Modal to confirm cancelling

formsReducer
*/

export const formsReducer = (state = { showTransferForm: false }, action) => {
	switch (action.type) {
		case 'SHOW_NEW_ORDER_MODAL':
			return { ...state, showNewOrderModal: true, newOrder: action.payload };
		case 'HIDE_NEW_ORDER_MODAL':
			return { ...state, showNewOrderModal: false, newOrder: {} };
		case 'SHOW_TRANSFER_FORM':
			return { ...state, showTransferForm: true, transferType: { type: action.payload.type, token: action.payload.token }};
		case 'HIDE_TRANSFER_FORM':
			return { ...state, showTransferForm: false, showTransferModal: false }
		case 'SHOW_TRANSFER_MODAL':
			return { ...state, showTransferModal: true };
		case 'DISMISS_TRANSFER_MODAL':
			return { ...state, showTransferModal: false };
		case 'SHOW_FILL_ORDER_MODAL':
			return { ...state, showFillOrderModal: true, orderToFill: action.payload };
		case 'HIDE_FILL_ORDER_MODAL':
			return { ...state, showFillOrderModal: false, orderToFill: {} };
		case 'SHOW_CANCEL_ORDER_MODAL':
			return { ...state, showCancelOrderModal: true, orderToCancel: action.payload };
		case 'HIDE_CANCEL_ORDER_MODAL':
			return { ...state, showCancelOrderModal: false, orderToCancel: {} };
		default:
			return state;
	}
}