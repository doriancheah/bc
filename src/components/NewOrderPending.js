import React, { Component } from 'react';
import { hourglass } from '../helpers';

class NewOrderPending extends Component {
	render() {
		return (
			<div className="spinner-parent">
				<div className="spinner-child animate-pending">{ hourglass() } New order pending...</div>
			</div>
			
		);
	};
}

export default NewOrderPending;
