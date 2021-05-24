import React from 'react';
import { connect } from 'react-redux';
import { myOpenOrdersSelector } from '../selectors';
import { cancelOrder, showCancelOrderModal } from '../actions/order';
import CancelOrderModal from './CancelOrderModal';

const MyOrders = (props) => {

	const renderMyOrders = (orders) => {
		return orders.map(order => {
			return (
				<tr key={order.id}>
					<td className={`text-${order.color}`}>{order.tok}</td>
					<td className={`text-${order.color}`}>{order.tokPrice}</td>		
					{renderCancelButton(order)}			
				</tr>
			);
		});
	}	

	const renderCancelButton = (order) => {
		if(order.pending) {
			return <td className="text-muted">PENDING</td>
		} else {
			return (
				<td 
					onClick={(e) => props.showCancelOrderModal(order)}
					className="text-muted use-pointer"
				>
					X {order.pending ? 'pending' : null}
				</td>
			);
		}
	}

	return (
		<React.Fragment>
			<table className="table table-dark table-sm small">
				<thead>
					<tr>
						<th>Amount</th>
						<th>DORY/ETH</th>
						<th>Cancel</th>
					</tr>
				</thead>
				<tbody>
					{ renderMyOrders(props.myOrders) }
				</tbody>
			</table>
			{ props.showModal ? <CancelOrderModal /> : null }		
		</React.Fragment>
	);	
}

const mapStateToProps = (state) => {
	return {
		myOrders: myOpenOrdersSelector(state),
		showModal: state.forms.showCancelOrderModal
	};
}

export default connect(mapStateToProps, { cancelOrder, showCancelOrderModal })(MyOrders);
