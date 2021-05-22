import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { balancesSelector } from '../selectors'
import { showTransferModal, dismissTransferModal, hideTransferForm } from '../actions/transfer';
import TransferModal from './TransferModal';

class TransferForm extends Component {

	renderError({ error, touched }) {
		if (touched && error) {
			return (
					<div className="invalid-feedback w-100 h1">{error}</div>
			);
		}
	}

	renderInput = ({ input, label, meta }) => {
		const className = `form-group`
		return (
			<div className={className}>
				<label htmlFor="">{label}</label>
				<input 
					{...input} 
					className={`form-control ${meta.error && meta.touched ? 'is-invalid' : ''}`} 
					autoComplete="off" 
					onClick={(e) => e.stopPropagation()}
				/>
				{this.renderError(meta)}
			</div>
		);
	}

	render() {
		const { type, token } = this.props.transferType;	
		return (
			<React.Fragment>
				<form 
					className="px-2 small" 
					onSubmit={this.props.handleSubmit(this.onSubmit)} 
				>
					<Field 
						name="amount" 
						component={this.renderInput} 
						label={`Enter amount of ${token} to ${type}`}
						placeholder={`Enter ${token} amount`}
						validate={this.validate} 
					/>
					<button className="btn btn-outline-success btn-sm">{type}&nbsp;{token}</button>					
				</form>
				{ this.props.showModal ? 
					<TransferModal onDismiss={this.props.dismissTransferModal} /> 
					: null	
				}			
			</React.Fragment>
		);
	};

	onSubmit = (formValues) => {
		this.props.showTransferModal();
	}

	validate = amount => {
		const { type, token } = this.props.transferType;
		const { walletEtherBal, walletTokenBal, exchangeEtherBal, exchangeTokenBal } = this.props.balances;
		if(isNaN(amount) || amount <= 0) {
			return 'Please enter a valid amount.';
		}
		if(type === 'withdraw' && token === 'DORY' && Number(amount) > Number(exchangeTokenBal)) {
			return 'Withdrawal amount exceeds token balance.'
		}
		if(type === 'withdraw' && token === 'ETH' && Number(amount) > Number(exchangeEtherBal)) {
			return 'Withdrawal amount exceeds ether balance.'
		}
		if(type === 'deposit' && token === 'DORY' && Number(amount) > Number(walletTokenBal)) {
			return 'Deposit amount exceeds wallet token balance.'
		}
		if(type === 'deposit' && token === 'ETH' && Number(amount) > Number(walletEtherBal)) {
			return 'Deposit amount exceeds wallet ether balance.'
		}
	}	
}



const mapStateToProps = (state) => {
	return {
		balances: balancesSelector(state),
		transferType: state.forms.transferType,
		showModal: state.forms.showTransferModal
	};
}

const wrappedForm = connect(
	mapStateToProps, 
	{ showTransferModal, dismissTransferModal, hideTransferForm }
)(TransferForm);

export default reduxForm({
	form: 'transferForm'
})(wrappedForm);
