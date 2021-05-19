import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import NoContent from './NoContent';    
import { contractsLoadedSelector } from '../selectors';
import { loadWeb3, loadAccount, loadToken, loadExchange } from '../actions';

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData();
  }

  loadBlockchainData = async () => {
    await this.props.loadWeb3();
    await this.props.loadAccount();
    await this.props.loadToken();
    await this.props.loadExchange();
  }

  render() {
    return (
      <div>
        <Navbar />
        { this.props.contractsLoaded ? <Content /> : <NoContent />}
      </div>
    );    
  }
}

const mapStateToProps = (state) => {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps, { loadWeb3, loadAccount, loadToken, loadExchange })(App);
