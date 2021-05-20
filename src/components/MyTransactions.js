import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { myTradesSelector, myOpenOrdersSelector } from '../selectors';
import { cancelOrder } from '../actions';
import Spinner from './Spinner';

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

	cancelOrder = (order) => {
		this.props.cancelOrder(order);
	}

	renderMyOrders = (orders) => {
		if(this.props.myEventPending) {
			return <Spinner type="table" />
		}
		return orders.map(order => {
			return (
				<tr key={order.id}>
					<td className={`text-${order.color}`}>{order.tok}</td>
					<td className={`text-${order.color}`}>{order.tokPrice}</td>					
					<td 
						onClick={(e) => this.cancelOrder(order)}
						className="text-muted cancel-order"
					>
						X
					</td>
				</tr>
			);
		});
	}	

	render() {
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
								<tbody>
									{this.renderMyOrders(this.props.myOrders)}
								</tbody>
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
		myTrades: myTradesSelector(state),
		myOrders: myOpenOrdersSelector(state),
		myEventPending: state.orders.myEventPending
	};
}
export default connect(mapStateToProps, { cancelOrder })(MyTransactions);
