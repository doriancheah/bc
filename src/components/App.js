import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import NoContent from './NoContent';    
import { loadWeb3, loadBlockchainData } from '../actions';
import { contractsLoadedSelector } from '../selectors';

class App extends Component {
  componentDidMount() {
    this.props.loadWeb3();
    this.props.loadBlockchainData();
  }

  render() {
    return (
      <div>
        <Navbar />
        { this.props.contractsLoaded && this.props.account ? 
          <Content /> : 
          <NoContent loadBlockchainData={this.props.loadBlockchainData} />
        }
      </div>
    );    
  }
}

const mapStateToProps = (state) => {
  return {
    contractsLoaded: contractsLoadedSelector(state),
    account: state.web3.account
  }
}

export default connect(mapStateToProps, { loadWeb3, loadBlockchainData })(App);

