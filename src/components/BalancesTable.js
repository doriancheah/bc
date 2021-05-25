import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { balancesSelector } from '../selectors';
import TransferButton from './TransferButton';
import TransferPending from './TransferPending';

const BalancesTable = (props) => {

	const { walletEtherBal, walletTokenBal, exchangeEtherBal, exchangeTokenBal } = props.balances;

	const walletEtherEl = useRef(null);
	const exchangeEtherEl = useRef(null);
	const walletTokenEl = useRef(null);
	const exchangeTokenEl = useRef(null);

	useEffect(() => {
		const elements = [
			walletEtherEl.current,
			exchangeEtherEl.current,
			walletTokenEl.current,
			exchangeTokenEl.current
		];

		const handleChangeEvent = (e, el) => {
			el.className = 'animate-update';
			setTimeout(() => {
				el.className = '';
			}, 5000);		
		}
		const addChangeHandler = (elem) => {
			elem.addEventListener('DOMSubtreeModified', (e) => handleChangeEvent(e, elem));
		}
		elements.map(el => addChangeHandler(el));

		return () => {
			elements.map(el => el.removeEventListener('DOMSubtreeModified', handleChangeEvent));
		}	
	}, [])

	const isZero = (amount) => {
		return Number(amount) === 0 ? true : false;
	}

	return (
		<React.Fragment>
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
						<td ref={walletEtherEl}>{walletEtherBal}</td>
						<TransferButton type="withdraw" token="ETH" disabled={ isZero(exchangeEtherBal) } />
						<TransferButton type="deposit" token="ETH" disabled={ isZero(walletEtherBal) } />
						<td ref={exchangeEtherEl}>{ exchangeEtherBal }</td>
					</tr>
					<tr>
						<td>DORY</td>
						<td ref={walletTokenEl}>{ walletTokenBal }</td>
						<TransferButton type="withdraw" token="DORY" disabled={ isZero(exchangeTokenBal) } />
						<TransferButton type="deposit" token="DORY" disabled={ isZero(walletTokenBal) } />
						<td ref={exchangeTokenEl}>{ exchangeTokenBal }</td>
					</tr>
				</tbody>
			</table>
			{ props.transferPending ? <TransferPending /> : null }				
		</React.Fragment>
	
	);	
}

const mapStateToProps = (state) => {
	return {
		balances: balancesSelector(state),
		transferPending: state.balances.transferPending
	};
}

export default connect(mapStateToProps)(BalancesTable);
