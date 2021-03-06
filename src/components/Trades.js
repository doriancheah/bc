import React from 'react';
import { connect } from 'react-redux';
import { filledOrdersLoaded } from '../selectors';
import TradeList from './TradeList';

import Spinner from './Spinner';

class Trades extends React.Component {

	render() {
		return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          Trades
        </div>
        <div className="card-body">
        	{ this.props.filledOrdersLoaded ? <TradeList /> : <Spinner /> }
        </div>
      </div>		
		);
	}
}

const mapStateToProps = (state) => {
	return {
		filledOrdersLoaded: filledOrdersLoaded(state),
	}
}

export default connect(mapStateToProps)(Trades);