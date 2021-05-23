import React from 'react';
import { connect } from 'react-redux';

import { makeOrder, hideNewOrderModal } from '../actions/order';
import Modal from './Modal';
import { withPrecision } from '../helpers';

const NewOrderModal = (props) => {
	console.log(props);
	
	const renderActions = () => {
		return (
			<React.Fragment>
        <button onClick={props.onDismiss} type="button" className="btn btn-outline-secondary btn-sm">Nevermind</button>
        <button onClick={makeOrder} type="button" className="btn btn-outline-success btn-sm">
        	Confirm Order
        </button>				
			</React.Fragment>
		);
	}

	const makeOrder = () => {
		console.log('makeOrder', props);
		props.makeOrder(props.newOrder);
		props.onDismiss();
	}

	return (
		<Modal 
			title="New Order"
			actions={renderActions()} 
			onDismiss={props.onDismiss} 
		>
			<div className="mb-3 h6">Are you sure you want to make this order?</div>
			<table>
				<tbody>
					<tr>
						<td className="pr-3">Type:</td><td>{props.newOrder.orderType.toUpperCase()}</td>
					</tr>
					<tr>
						<td className="pr-3">Quantity:</td><td>{props.newOrder.amount} DORY</td>
					</tr>
					<tr>
						<td className="pr-3">Price:</td><td>{props.newOrder.price} DORY/ETH</td>
					</tr>
					<tr>
						<td className="pr-3">Subtotal:</td><td>{withPrecision(props.newOrder.subtotal, 8)} ETH</td>
					</tr>			
				</tbody>
			</table>
		</Modal>
	);
}

const mapStateToProps = (state) => {
	return {
		newOrder: state.forms.newOrder
	};
}

export default connect(mapStateToProps, { makeOrder, hideNewOrderModal })(NewOrderModal);



