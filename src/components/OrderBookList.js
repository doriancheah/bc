import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { orderBookSelector } from '../selectors';
import { showFillOrderModal } from '../actions/order';
import OrderBookHeader from './OrderBookHeader';
import FillOrderModal from './FillOrderModal';
import { BUY, SELL } from '../helpers';

class OrderBookList extends React.Component {
	renderOrders = (orders, type) => {
		return orders.map(order => {
			const [row, tooltip] = this.renderRow(order, type);
			return (
				<OverlayTrigger
					key={order.id}
					placement="auto"
					overlay={
						<Tooltip id={order.id}>
							{tooltip}
						</Tooltip>
					}
				>
					{row}
				</OverlayTrigger>				
			);
		});
	}

	renderRow = (order, type) => {
		const fillAction = type === BUY ? SELL : BUY;
		let row, tooltip;
		if(order.pending) {
			row = this.renderPending(order);	
			tooltip = 'Pending';
		} else if(order.user === this.props.account) {
			row = this.renderMyOrder(order, type);
			tooltip = 'View or cancel this order in My Transactions';
		} else {
			row = (
				<tr onClick={(e) => this.props.showFillOrderModal(order)} className="use-pointer">
	        <td>{order.tok}</td>
					<td className={`text-${ type === BUY ? 'success' : 'danger'}`}>{order.tokPrice}</td>
					<td>{order.eth}</td>					
				</tr>					
			);
			tooltip = `Click to ${fillAction} ${order.tok} DORY @ ${order.tokPrice}`;
		}
		return [row, tooltip];
	}

	renderPending = order => (
		<tr className="animate-pending">
		  <td>{order.tok}</td>
			<td>{order.tokPrice}</td>
			<td>{order.eth}</td>					
		</tr>										
	);

	renderMyOrder = (order, type) => (
		<tr>
      <td>{order.tok}</td>
			<td className={`text-${ type === BUY ? 'success' : 'danger'}`}>{order.tokPrice}</td>
			<td>{order.eth}</td>					
		</tr>					
	);

	render() {
		return (
			<React.Fragment>
	    	<table className="table table-dark table-sm small">
	    		<thead>
	    			<OrderBookHeader />	
	    		</thead>
	    		<tbody>
	    			{this.renderOrders(this.props.orderBook.sellOrders, SELL)}
	    			<OrderBookHeader />
						{this.renderOrders(this.props.orderBook.buyOrders, BUY)}    			
	    		</tbody>
	    	</table>	
	    	{ this.props.showModal ? <FillOrderModal /> : null }					
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		account: state.web3.account,
		orderBook: orderBookSelector(state),
		showModal: state.forms.showFillOrderModal
	}
}

export default connect(mapStateToProps, { showFillOrderModal })(OrderBookList);