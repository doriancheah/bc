import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { myTradesSelector } from '../selectors';

class MyTransactions extends React.Component {
	renderMyTrades = (orders) => {
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
	render() {
		console.log(this.props.myTrades)
		return (
			<div className="card bg-dark text-white">
				<div className="card-header">
					My Transactions
				</div>
				<div className="card-body">
					<Tabs defaultActiveKey="trades" className="bg-dark text-white">
						<Tab eventKey="trades" title="Trades" className="bg-dark">
							<table className="table table-dark table-sm small">
								<thead>
									<tr>
										<th>Time</th>
										<th>DORY</th>
										<th>DORY/ETH</th>
									</tr>
								</thead>
								<tbody>
									{this.renderMyTrades(this.props.myTrades)}
								</tbody>
							</table>
						</Tab>
						<Tab eventKey="orders" title="Orders">
							<table className="table table-dark table-sm small">
								<thead>
									<tr>
										<th>Amount</th>
										<th>DORY/ETH</th>
										<th>Cancel</th>
									</tr>
								</thead>
							</table>
						</Tab>						
					</Tabs>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		myTrades: myTradesSelector(state)
	};
}
export default connect(mapStateToProps)(MyTransactions);
