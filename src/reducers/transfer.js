export const transferReducer = (state = {}, action) => {
	switch (action.type) {
		case 'SHOW_TRANSFER_FORM':
			return { ...state, form: { type: action.payload.type, token: action.payload.token }};
		default:
			return state;
	}
}