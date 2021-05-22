import React from 'react';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';
import { 
	hideTransferForm, 
	depositToken,
	withdrawToken,
	depositEther,
	withdrawEther
} from '../actions/transfer';
import Modal from './Modal';

const TransferModal = (props) => {

	const { 
		transferType, 
		amount, 
		onDismiss, 
		hideTransferForm, 
		depositToken, 
		withdrawToken,
		depositEther,
		withdrawEther 
	} = props;
	
	const renderActions = () => {
		return (
			<React.Fragment>
        <button onClick={onDismiss} type="button" className="btn btn-outline-secondary btn-sm">Cancel</button>
        <button onClick={doTransfer} type="button" className="btn btn-outline-success btn-sm">
        	{upperFirst(transferType.type)}
        </button>				
			</React.Fragment>
		);
	}

	const doTransfer = () => {
		if(transferType.type === 'deposit' && transferType.token === 'DORY') {
			depositToken(amount);
		}
		else if(transferType.type === 'withdraw' && transferType.token === 'DORY') {
			withdrawToken(amount);
		}
		else if(transferType.type === 'deposit' && transferType.token === 'ETH') {
			depositEther(amount);
		}
		else {
			withdrawEther(amount);
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
		transferType: state.forms.transferType,
		amount: state.form.transferForm.values.amount
	};
}

export default connect(mapStateToProps, { 
	hideTransferForm, 
	depositToken,
	withdrawToken,
	depositEther,
	withdrawEther
})(TransferModal);



