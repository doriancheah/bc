import React from 'react';
import { connect } from 'react-redux';
import { arrowLeft, arrowRight } from '../helpers';
import { showTransferForm } from '../actions/transfer';

class TransferButton extends React.Component {
	render() {
		const { type, token, disabled } = this.props;
		return (
			<td 
				className={ disabled ? 'text-muted' : 'use-pointer'}
				onClick={ disabled ? null : () => { this.props.showTransferForm(type, token) }}
			>
				{ type === 'withdraw' ? arrowLeft() : arrowRight() }
			</td>
		);
	}
}

export default connect(null, { showTransferForm })(TransferButton);