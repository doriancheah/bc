import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { lastTradeSelector, balancesSelector } from '../selectors';
import { showNewOrderModal, hideNewOrderModal } from '../actions/order';
import NewOrderModal from './NewOrderModal';
import NewOrderPending from './NewOrderPending';
import { BUY, SELL, withPrecision } from '../helpers';

class NewOrderForm extends Component {
	componentDidMount() {
		//this.props.initialize({ orderType: BUY, price: '0' });
		this.props.initialize({ orderType: BUY, price: this.props.lastTrade.tokPrice });
		console.log(this.props)
	}

	renderRadioField = ({ input, meta, label }) => {
		return (
			<div className="row py-3 px-3">
				<div className="col">
				  <label className="form-check-label">
				  	<input {...input} type="radio" value={BUY} checked={input.value === BUY} />
				  	{' '}Buy
				  </label>
				</div>									
				<div className="col">
				  <label className="form-check-label">
				  	<input {...input} type="radio" value={SELL} checked={input.value === SELL}/>
				  	{' '}Sell
				  </label>
				</div>									
			</div>
		);
	}

	renderInput = ({ input, label, meta, placeholder }) => {
		const className = `form-group`
		return (
			<div className={className}>
				<label htmlFor="">{label}</label>
				<input 
					{...input} 
					className={`form-control ${meta.error && meta.touched ? 'is-invalid' : ''}`}
					autoComplete="off" 
					placeholder={placeholder}
				/>
				{this.renderError(meta)}
			</div>
		);
	}

	renderError = ({ error, touched }) => {
		if (touched && error) {
			return (
					<div className="invalid-feedback w-100">{error}</div>
			);
		}
	}

	renderSubtotal = () => {
		return isNaN(this.props.subtotal) ? null : withPrecision(this.props.subtotal, 8) + ' ETH';
	}

	render() {
		if(this.props.makingOrder) {
			return <NewOrderPending />;
		}
		return (
			<React.Fragment>
		    <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
		    	<Field name="orderType" component={this.renderRadioField} />
					<div className="form-group px-3 small">
						<Field 
							name="amount" 
							component={this.renderInput} 
							label={`Amount of DORY to ${this.props.orderTypeSelected}`}
							placeholder={`Enter amount`}
							validate={this.validate}								
						/>
						<Field 
							name="price" 
							component={this.renderInput} 
							label={`Enter price`}
							placeholder={`Enter price`}
							validate={this.validate}
						/>
					<div className="w-100">Order Subtotal: {this.renderSubtotal()}</div>
					
					</div>
					<div className="form-row w-100 px-3 mt-4">
						<div className="col-auto">
							<button className="btn btn-outline-success btn-sm">Submit Order</button>
						</div>
						<div className="col">
							<button 
								className="btn btn-outline-secondary btn-sm btn-block" 
								type="button"
								onClick={this.clearForm}
							>
								Clear
							</button>
						</div>
					</div>						      
		    </form>
		    { this.props.showModal ? <NewOrderModal onDismiss={this.dismissModal} /> : null }			
			</React.Fragment>
		);
	}
	
	dismissModal = () => {
		this.props.hideNewOrderModal();
		this.clearForm();
	}

	clearForm = () => {
		this.props.dispatch(this.props.reset());
	}

	validate = (value, allValues, props, name) => {
		const [ price, amount ] = [ Number(allValues.price), Number(allValues.amount) ];
		const [ etherBal, tokenBal ] = [
			Number(this.props.balances.exchangeEtherBal),
			Number(this.props.balances.exchangeTokenBal)
		];

		if(isNaN(value) || value <= 0) {
			return `Please enter a valid ${name}.`;
		}

		if(allValues.orderType === BUY && price * amount > etherBal) {
			return `Order exceeds available balance.`
		}

		if(allValues.orderType === SELL && amount > tokenBal) {
			return `Order exceeds available balance.`
		}
	}	

	onSubmit = (formValues) => {
		console.log({...formValues, subtotal: this.props.subtotal});
		this.props.showNewOrderModal({...formValues, subtotal: this.props.subtotal});
	}	

}

const selector = formValueSelector('newOrderForm');

const mapStateToProps = (state) => {

	const orderTypeSelected = selector(state, 'orderType');
	const amountSelected = selector(state, 'amount');
	const priceSelected = selector(state, 'price');

	return {
		makingOrder: state.orders.makingOrder,
		showModal: state.forms.showNewOrderModal,
		lastTrade: lastTradeSelector(state),
		balances: balancesSelector(state),
		orderTypeSelected,
		amountSelected,
		priceSelected,
		subtotal: withPrecision(Number(amountSelected) * Number(priceSelected), 8)
	};
}

const wrappedForm = connect(mapStateToProps, { showNewOrderModal, hideNewOrderModal })(NewOrderForm);

export default reduxForm({ form: 'newOrderForm' })(wrappedForm);
