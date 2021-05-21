import React from 'react';
import { connect } from 'react-redux';
import { getBalances } from '../actions';
import { balancesSelector } from '../selectors';
import TransferForm from './TransferForm';
import BalancesTable from './BalancesTable';
import Spinner from './Spinner';

class Balance extends React.Component {
	componentDidMount() {
		this.props.getBalances();
	}

	render() {
	
		return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          My Balances
        </div>
        <div className="card-body">
        	{this.props.balances.loaded ? <BalancesTable /> : <Spinner />}
        	{this.props.showForm ? <TransferForm /> : null}	
        </div>
      </div>			
		);
	}
}

const mapStateToProps = (state) => {
	return {
		form: state.transfers.form,
		showForm: state.transfers.showForm,
		balances: balancesSelector(state)
	}
}

export default connect(mapStateToProps, { getBalances })(Balance);