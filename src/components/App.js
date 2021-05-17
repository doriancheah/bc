import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Navbar from './Navbar';
import Content from './Content';
import NoContent from './NoContent';
import { contractsLoadedSelector } from '../selectors';

//import { loadWeb3, loadAccount, loadToken, loadExchange } from '../store/interactions';
import { loadWeb3, loadAccount, loadToken, loadExchange } from '../actions';
import { accountSelector, tokenAddressSelector } from '../selectors';

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData();
  }

  loadBlockchainData = async () => {
    await this.props.loadWeb3();
    await this.props.loadAccount();
    await this.props.loadToken();
    await this.props.loadExchange();
/*    
    const web3 = loadWeb3(dispatch);
    const networkId = await web3.eth.net.getId();
    const account = await loadAccount(web3, dispatch);
    const token = await loadToken(web3, networkId, dispatch);
    const exchange = await loadExchange(web3, networkId, dispatch);
    console.log(await token.methods.name().call());*/
  }

  test = async () => {
    window.alert(await this.props.contracts.token.methods.balanceOf('0x95C283d0f15D633C25fc979E79A807AF414d87a5').call());
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
