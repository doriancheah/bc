import React from 'react';
import { connect } from 'react-redux';
import { getBalances } from '../actions';
import { getCancelledOrders, getTrades, getAllOrders } from '../actions/order';
import { 
  subscribeToCancelEvents, 
  subscribeToFillEvents,
  subscribeToOrderEvents
} from '../actions/subscribe';
import OrderBook from './OrderBook';
import Trades from './Trades';
import PriceChart from './PriceChart';
import MyTransactions from './MyTransactions';
import Balance from './Balance';
import NewOrder from './NewOrder';



class Content extends React.Component {
	componentDidMount() {
		this.props.getCancelledOrders();
		this.props.getTrades();
		this.props.getAllOrders();
    this.props.getBalances();
    this.props.subscribeToOrderEvents();
    this.props.subscribeToFillEvents();
    this.props.subscribeToCancelEvents();
	}
	render() {
		return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
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
  getBalances,
  getCancelledOrders, 
  getTrades, 
  getAllOrders,
  subscribeToFillEvents,
  subscribeToCancelEvents,
  subscribeToOrderEvents
})(Content);



