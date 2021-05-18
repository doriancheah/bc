import React from 'react';
import { connect } from 'react-redux';
import { filledOrdersSelector } from '../selectors';

class TradeList extends React.Component {
	renderTrades = (orders) => {
		return orders.map(order => {
			return (
				<tr key={order.id}>
	        <td className="text-muted">{order.humanTime}</td>
					<td>{order.tok}</td>
					<td className={`text-${order.color}`}>{order.tokPrice}</td>					
				</tr>
			);
		});
	}

	render() {
		return (
    	<table className="table table-dark table-sm small">
    		<thead>
    			<tr>
    				<th>Time</th>
    				<th>DORY</th>
    				<th>DORY/ETH</th>
    			</tr>
    		</thead>
    		<tbody>
    			{this.renderTrades(this.props.filledOrders)}
    		</tbody>
    	</table>		

		);
	}
}

const mapStateToProps = (state) => {
	return {
		filledOrders: filledOrdersSelector(state)
	}
}

export default connect(mapStateToProps)(TradeList);