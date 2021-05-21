import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { orderBookSelector } from '../selectors';
import { fillOrder } from '../actions/order';
import OrderBookHeader from './OrderBookHeader';
import { BUY, SELL } from '../helpers';

class OrderBookList extends React.Component {
	renderOrders = (orders, type) => {
		return orders.map(order => {
			const fillAction = type;
			return (
				<OverlayTrigger
					key={order.id}
					placement="auto"
					overlay={
						<Tooltip id={order.id}>
							{`${order.id}: Click to ${fillAction} ${order.tok} DORY @ ${order.tokPrice}`}
						</Tooltip>
					}
				>
					<tr onClick={(e) => this.props.fillOrder(order)} className="use-pointer">
		        <td>{order.tok}</td>
						<td className={`text-${ type === BUY ? 'success' : 'danger'}`}>{order.tokPrice}</td>
						<td>{order.eth}</td>					
					</tr>
				</OverlayTrigger>				
			);
		});
	}

	render() {
		return (
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
		);
	}
}

const mapStateToProps = (state) => {
	return {
		orderBook: orderBookSelector(state)
	}
}

export default connect(mapStateToProps, { fillOrder })(OrderBookList);