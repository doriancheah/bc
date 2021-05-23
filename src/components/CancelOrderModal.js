import React from 'react';
import { connect } from 'react-redux';

import { hideCancelOrderModal, cancelOrder } from '../actions/order';
import Modal from './Modal';
import { withPrecision } from '../helpers';

const CancelOrderModal = (props) => {
	const { order } = props;

	const renderActions = () => {
		return (
			<React.Fragment>
        <button onClick={props.hideCancelOrderModal} type="button" className="btn btn-outline-secondary btn-sm">Nevermind</button>
        <button onClick={doCancel} type="button" className="btn btn-outline-success btn-sm">
        	Yes, Cancel Order
        </button>				
			</React.Fragment>
		);
	}

	const doCancel = () => {
		props.cancelOrder(order);
		props.hideCancelOrderModal();
	}

	return (
		<Modal 
			title="Cancel Order"
			actions={renderActions()} 
			onDismiss={props.hideCancelOrderModal} 
		>
			<div className="mb-3 h6">Are you sure you want to cancel this order?</div>
			<table>
				<tbody>
					<tr>
						<td className="pr-3">Type:</td><td>{order.orderType.toUpperCase()}</td>
					</tr>
					<tr>
						<td className="pr-3">Quantity:</td><td>{order.tok} DORY</td>
					</tr>
					<tr>
						<td className="pr-3">Price:</td><td>{order.tokPrice} DORY/ETH</td>
					</tr>
					<tr>
						<td className="pr-3">Subtotal:</td><td>{withPrecision(order.tok * order.tokPrice, 8)} ETH</td>
					</tr>			
				</tbody>
			</table>
		</Modal>
	);
}

const mapStateToProps = (state) => {
	return {
		order: state.forms.orderToCancel,
	};
}

export default connect(mapStateToProps, { cancelOrder, hideCancelOrderModal })(CancelOrderModal);



