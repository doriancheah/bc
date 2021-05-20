import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import { getBalances } from '../actions';
import { balancesSelector } from '../selectors';
import { arrowLeft, arrowRight } from '../helpers';
import TransferButton from './TransferButton';

class Balance extends React.Component {
	componentDidMount() {
		this.props.getBalances();
	}

	renderForm = () => {
		const { type, token } = this.props.form;
		const { walletEtherBal, walletTokenBal, exchangeEtherBal, exchangeTokenBal } = this.props.balances;
		// TO DO: build this form
		return <div>{ type } { token }</div>;
	}

	render() {
		const { walletEtherBal, walletTokenBal, exchangeEtherBal, exchangeTokenBal } = this.props.balances;
		return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          Balance
        </div>
        <div className="card-body">
					<table className="table table-dark table-sm small">
						<thead>
							<tr>
								<th>Asset</th>
								<th>Wallet</th>
								<th></th>
								<th></th>
								<th>Exchange</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ETH</td>
								<td>{ walletEtherBal }</td>
								<TransferButton type="withdraw" token="ETH" />
								<TransferButton type="deposit" token="ETH" />
								<td>{ exchangeEtherBal }</td>
							</tr>
							<tr>
								<td>DORY</td>
								<td>{ walletTokenBal }</td>
								<TransferButton type="withdraw" token="DORY" />
								<TransferButton type="deposit" token="DORY" />
								<td>{ exchangeTokenBal }</td>
							</tr>
						</tbody>
					</table>
        	{this.props.form ? this.renderForm() : null}	
        </div>
      </div>			
		);
	}
}

const mapStateToProps = (state) => {
	return {
		balances: balancesSelector(state),
		form: state.transfers.form
	}
}

export default connect(mapStateToProps, { getBalances })(Balance);