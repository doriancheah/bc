import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
//import { loadWeb3, loadAccount, loadToken, loadExchange } from '../store/interactions';
import { loadWeb3, loadAccount, loadToken, loadExchange } from '../actions';

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData();
    console.log(this.props);
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

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="/#">asdfsd</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/#">Link 1</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#">Link 2</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#">Link 3</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="content">
          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">
                TItlea
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );    
  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    account: state.web3.account,
    contracts: state.contracts
  }
}

export default connect(mapStateToProps, { loadWeb3, loadAccount, loadToken, loadExchange })(App);
