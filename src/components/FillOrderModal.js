import React from 'react';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';

import { hideFillOrderModal, fillOrder } from '../actions/order';
import Modal from './Modal';
import { BUY, SELL, FEE_PERCENT, withPrecision } from '../helpers';

const FillOrderModal = (props) => {
	const { order } = props;
	const fillAction = order.orderType === BUY ? SELL : BUY;
	const renderActions = () => {
		return (
			<React.Fragment>
        <button onClick={props.hideFillOrderModal} type="button" className="btn btn-outline-secondary btn-sm">Cancel</button>
        <button onClick={doFill} type="button" className="btn btn-outline-success btn-sm">
        	{upperFirst(fillAction)}
        </button>				
			</React.Fragment>
		);
	}

	const doFill = () => {
		props.fillOrder(order);
		props.hideFillOrderModal();
	}

	console.log(order);
	// sell order, fee is paid in ether. for buy order, pay in dory.

	const fee = () => {
		const feeToken = order.orderType === BUY ? 'DORY' : 'ETH';
		const feeAmount = order.orderType === BUY ? order.tok * FEE_PERCENT : order.eth * FEE_PERCENT
		return `${withPrecision(feeAmount, 8)} ${feeToken}`;
	}
	return (
		<Modal 
			title={`${upperFirst(fillAction)} DORY?`}
			actions={renderActions()} 
			onDismiss={props.hideFillOrderModal} 
		>
			<table>
				<tbody>
					<tr>
						<td className="pr-3">Quantity:</td><td>{order.tok} DORY</td>
					</tr>
					<tr>
						<td className="pr-3">Price:</td><td>{order.tokPrice} DORY/ETH</td>
					</tr>
					<tr>
						<td className="pr-3">Subtotal:</td><td>{withPrecision(order.tok * order.tokPrice, 8)} ETH</td>
					</tr>
					<tr>
						<td className="pr-3">Exchange Fee:</td><td>{fee()}</td>
					</tr>					
				</tbody>
			</table>
		</Modal>
	);
}

const mapStateToProps = (state) => {
	return {
		order: state.forms.orderToFill,
	};
}

export default connect(mapStateToProps, { fillOrder, hideFillOrderModal })(FillOrderModal);



