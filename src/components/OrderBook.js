import React from 'react';
import { connect } from 'react-redux';
import { orderBookLoadedSelector } from '../selectors';
import OrderBookList from './OrderBookList';
import Spinner from './Spinner';

class OrderBook extends React.Component {
	render() {
		return (
			<div className="vertical">
	      <div className="card bg-dark text-white">
	        <div className="card-header">
	          Order Book
	        </div>
	        <div className="card-body order-book">
	        	{ this.props.orderBookLoaded ? <OrderBookList /> : <Spinner /> }
	        </div>
	      </div>		
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		orderBookLoaded: orderBookLoadedSelector(state),
		myEventPending: state.orders.myEventPending
	}
}
export default connect(mapStateToProps)(OrderBook);