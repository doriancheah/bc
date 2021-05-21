import React from 'react';
import { connect } from 'react-redux';
import { getCancelledOrders, getTrades, getAllOrders } from '../actions/order';
import { subscribeToCancelEvents, subscribeToFillEvents } from '../actions/subscribe';
import OrderBook from './OrderBook';
import Trades from './Trades';
import PriceChart from './PriceChart';
import MyTransactions from './MyTransactions';
import Balance from './Balance';


class Content extends React.Component {
	componentDidMount() {
		this.props.getCancelledOrders();
		this.props.getTrades();
		this.props.getAllOrders();
    this.props.subscribeToFillEvents();
    this.props.subscribeToCancelEvents();
	}
	render() {
		return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
        </div>
        <OrderBook />
        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>
        <div className="vertical">
        	<Trades />
        </div>
      </div>			
		);
	}
}

const mapStateToProps = (state) => {
	return {

	}
}

export default connect(mapStateToProps, { 
  getCancelledOrders, 
  getTrades, 
  getAllOrders,
  subscribeToFillEvents,
  subscribeToCancelEvents
})(Content);



