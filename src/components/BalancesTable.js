import React, { Component } from 'react';
import { connect } from 'react-redux';
import { balancesSelector } from '../selectors';
import TransferButton from './TransferButton';

class BalancesTable extends Component {

	isZero(amount) {
		return Number(amount) === 0 ? true : false;
	}

	render() {
		const { walletEtherBal, walletTokenBal, exchangeEtherBal, exchangeTokenBal } = this.props.balances;
		return (
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
						<TransferButton type="withdraw" token="ETH" disabled={ this.isZero(exchangeEtherBal) } />
						<TransferButton type="deposit" token="ETH" disabled={ this.isZero(walletEtherBal) } />
						<td>{ exchangeEtherBal }</td>
					</tr>
					<tr>
						<td>DORY</td>
						<td>{ walletTokenBal }</td>
						<TransferButton type="withdraw" token="DORY" disabled={ this.isZero(exchangeTokenBal) } />
						<TransferButton type="deposit" token="DORY" disabled={ this.isZero(walletTokenBal) } />
						<td>{ exchangeTokenBal }</td>
					</tr>
				</tbody>
			</table>			
		);
	};
}

const mapStateToProps = (state) => {
	return {
		balances: balancesSelector(state),
	};
}

export default connect(mapStateToProps)(BalancesTable);
