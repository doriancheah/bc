import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import MyTrades from './MyTrades';
import MyOrders from './MyOrders';

const MyTransactions = () => {

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">
				My Transactions
			</div>
			<div className="card-body">
				<Tabs defaultActiveKey="trades" className="bg-dark text-white">
					<Tab eventKey="trades" title="Trades" className="bg-dark">
						<MyTrades />						
					</Tab>
					<Tab eventKey="orders" title="Orders">
						<MyOrders />
					</Tab>						
				</Tabs>
			</div>
		</div>		
	);
}

export default MyTransactions;
