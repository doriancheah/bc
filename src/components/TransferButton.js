import React from 'react';
import { connect } from 'react-redux';
import { arrowLeft, arrowRight } from '../helpers';
import { showTransferForm } from '../actions/transfer';

class TransferButton extends React.Component {
	render() {
		const { type, token } = this.props;
		return (
			<td 
				className="use-pointer"
				onClick={() => { this.props.showTransferForm(type, token) }}
			>
				{ type === 'withdraw' ? arrowLeft() : arrowRight() }
			</td>
		);
	}
}

export default connect(null, { showTransferForm })(TransferButton);