import React, { Component } from 'react';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';
import { 
	hideTransferForm, 
	depositToken,
	withdrawToken,
} from '../actions/transfer';
import Modal from './Modal';

const TransferModal = (props) => {

	const { transferType, amount, onDismiss, hideTransferForm, depositToken, withdrawToken } = props;
	
	const renderActions = () => {
		return (
			<React.Fragment>
        <button onClick={onDismiss} type="button" className="btn btn-secondary">Cancel</button>
        <button onClick={doTransfer} type="button" className="btn btn-primary">
        	{upperFirst(transferType.type)}
        </button>				
			</React.Fragment>
		);
	}

	const doTransfer = () => {
		console.log(transferType);
		if(transferType.type === 'deposit' && transferType.token === 'DORY') {
			depositToken(amount);
		}
		else if(transferType.type === 'withdraw' && transferType.token === 'DORY') {
			console.log('call withdrawToken');
			withdrawToken(amount);
		}
		else if(transferType.type === 'withdraw' && transferType.token === 'DORY') {
			//depositEther(amount);
			console.log('deposit ether');
		}
		else {
			//withdrawEther(amount);
			console.log('withdraw ether');
		}
		onDismiss();
		hideTransferForm();
	}

	const fromTo = transferType.type === 'withdraw' ? 
		'from the exchange to your wallet'
		: 'from your wallet to the exchange';

	return (
		<Modal 
			title={`${upperFirst(transferType.type)} ${transferType.token}`}
			content={`Are you sure you want to transfer ${amount} ${transferType.token} ${fromTo}?`}
			actions={renderActions()} 
			onDismiss={onDismiss} 
		/>
	);
}

const mapStateToProps = (state) => {
	return {
		transferType: state.transfers.form,
		amount: state.form.transferForm.values.amount
	};
}

export default connect(mapStateToProps, { 
	hideTransferForm, 
	depositToken,
	withdrawToken,
})(TransferModal);



