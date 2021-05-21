export const transferReducer = (state = { showForm: false }, action) => {
	switch (action.type) {
		case 'SHOW_TRANSFER_FORM':
			return { ...state, showForm: true, form: { type: action.payload.type, token: action.payload.token }};
		case 'HIDE_TRANSFER_FORM':
			return { ...state, showForm: false, showModal: false }
		case 'SHOW_TRANSFER_MODAL':
			return { ...state, showModal: true };
		case 'DISMISS_TRANSFER_MODAL':
			return { ...state, showModal: false };
		default:
			return state;
	}
}