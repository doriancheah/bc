import React from 'react';
import { connect } from 'react-redux';
import { getBalances } from '../actions';
import TransferForm from './TransferForm';
import BalancesTable from './BalancesTable';
import Spinner from './Spinner';

class Balance extends React.Component {
	componentDidMount() {
		//this.props.getBalances();
	}

	render() {
	
		return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          My Balances
        </div>
        <div className="card-body">
        	{this.props.balancesLoaded ? <BalancesTable /> : <Spinner />}
        	{this.props.showTransferForm ? <TransferForm /> : null}	
        </div>
      </div>			
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showTransferForm: state.forms.showTransferForm,
		balancesLoaded: state.balances.loaded
	}
}

export default connect(mapStateToProps, { getBalances })(Balance);