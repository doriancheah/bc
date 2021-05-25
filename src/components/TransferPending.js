import React, { Component } from 'react';
import { hourglass } from '../helpers';

class TransferPending extends Component {
	render() {
		return (
			<div className="spinner-parent">
				<div className="spinner-child animate-pending">{ hourglass() } Transfer pending...</div>
			</div>
			
		);
	};
}

export default TransferPending;
