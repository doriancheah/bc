import React from 'react';
import { connect } from 'react-redux';
import { orderBookSelector } from '../selectors';
import OrderBookHeader from './OrderBookHeader';

class OrderBookList extends React.Component {
	renderOrders = (orders, type) => {
		return orders.map(order => {
			return (
				<tr key={order.id}>
	        <td>{order.tok}</td>
					<td className={`text-${ type === 'buy' ? 'success' : 'danger'}`}>{order.tokPrice}</td>
					<td>{order.eth}</td>					
				</tr>
			);
		});
	}

	render() {
		console.log(this.props.orderBook);
		return (
    	<table className="table table-dark table-sm small">
    		<thead>
    			<OrderBookHeader />	
    		</thead>
    		<tbody>
    			{this.renderOrders(this.props.orderBook.sellOrders, 'sell')}
    			<OrderBookHeader />
					{this.renderOrders(this.props.orderBook.buyOrders, 'buy')}    			
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

export default connect(mapStateToProps)(OrderBookList);