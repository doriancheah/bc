import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { contractsLoadedSelector } from '../selectors';

const NoContent = ({ web3, account, contractsLoaded }) => {

	const messageRef = useRef(null);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			messageRef.current.innerHTML = 'Cannot load application.';

		}, 5000);
		return () => {
			clearTimeout(timeoutId);
		}
	}, [])

	return (
    <div className="content">
      <div className="no-contract" ref={messageRef}>
      	<div className="">Loading web3...? { web3 ? 'OK' : 'PLEASE INSTALL METAMASK' }</div>
      	<div className="">Loading account... { account ? 'OK' : 'PLEASE AUTHORIZE METAMASK TO CONNECT' }</div>
      	<div className="">Loading smart contracts... { contractsLoaded ? 'OK' : 'PLEASE CHOOSE A VALID NETWORK' }</div>
      </div>
    </div>			
	);
}

const mapStateToProps = (state) => {
  return {
    contractsLoaded: contractsLoadedSelector(state),
    account: state.web3.account,
    web3: state.web3
  }
}
export default connect(mapStateToProps)(NoContent);