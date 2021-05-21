import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
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
		const { type, token } = this.props.transferForm;	
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
		// send action to show modal
		this.props.showTransferModal();
		console.log(formValues);
	}
}

const validate = (formValues) => {
	const errors = {};
	if (isNaN(formValues.amount) || formValues.amount <= 0) {
		errors.amount = 'Please enter a valid amount.';
	}
	return errors;
}

const mapStateToProps = (state) => {
	return {
		transferForm: state.transfers.form,
		showModal: state.transfers.showModal
	};
}

const wrappedForm = connect(
	mapStateToProps, 
	{ showTransferModal, dismissTransferModal, hideTransferForm }
)(TransferForm);

export default reduxForm({
	form: 'transferForm',
	validate
})(wrappedForm);
