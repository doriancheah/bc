import React from 'react';
import { connect } from 'react-redux';
import { filledOrdersLoadedSelector } from '../selectors';
import TradeList from './TradeList';

import Spinner from './Spinner';

class Trades extends React.Component {

	render() {
		return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          TRADES
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
		filledOrdersLoaded: filledOrdersLoadedSelector(state),
	}
}

export default connect(mapStateToProps)(Trades);