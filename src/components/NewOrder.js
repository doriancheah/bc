import React from 'react';


import { connect } from 'react-redux';
import { filledOrdersLoaded } from '../selectors';

import NewOrderForm from './NewOrderForm';
import Spinner from './Spinner';

class NewOrder extends React.Component {


	render() {

		return (
	    <div className="card bg-dark text-white">
	      <div className="card-header">
	        New Order
	      </div>
	      <div className="card-body">
	      	{ this.props.filledOrdersLoaded && this.props.balancesLoaded ? <NewOrderForm /> : <Spinner /> }
	      </div>
	    </div>
		);	
	}
}

const mapStateToProps = (state) => {
	return {
    filledOrdersLoaded: filledOrdersLoaded(state),
    balancesLoaded: state.balances.loaded
	};
}

export default connect(mapStateToProps)(NewOrder);
