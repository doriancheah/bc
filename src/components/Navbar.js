import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { accountSelector, tokenAddressSelector } from '../selectors';

class Navbar extends React.Component {

	render() {
		return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="/#">DoryX</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
        	<li className="nav-item">
        		<a 
        			className="nav-link small"
        			href={`https://etherscan.io/address/${this.props.account}`}
        			target="_blank"
        			rel="noopener noreferrer"
        		>
        			{this.props.account}
        		</a>
        	</li>
        </ul>
      </nav>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		account: get(state, 'web3.account')
	}
}

export default connect(mapStateToProps)(Navbar);
