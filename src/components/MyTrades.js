import React from 'react';
import { connect } from 'react-redux';
import { myTradesSelector } from '../selectors';

const MyTrades = (props) => {

	const renderMyTrades = (orders) => {
		return orders.map(order => {
			return (
				<tr key={order.id}>
	        <td className="text-muted">{order.humanTime}</td>
					<td className={`text-${order.color}`}>{order.sign + order.tok}</td>
					<td className={`text-${order.color}`}>{order.tokPrice}</td>					
				</tr>
			);
		});
	}	

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
				{renderMyTrades(props.myTrades)}
			</tbody>
		</table>		
	);
}

const mapStateToProps = (state) => {
	return {
		myTrades: myTradesSelector(state),
	};
}

export default connect(mapStateToProps)(MyTrades);
