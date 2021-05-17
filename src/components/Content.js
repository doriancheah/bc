import React from 'react';
import { connect } from 'react-redux';
import { getCancelledOrders, getTrades, getAllOrders } from '../actions';
import Trades from './Trades';

class Content extends React.Component {
	componentDidMount() {
		this.props.getCancelledOrders();
		this.props.getTrades();
		this.props.getAllOrders();
	}
	render() {
		return (
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
        	<Trades />
        </div>
      </div>			
		);
	}
}

const mapStateToProps = (state) => {
	return {

	}
}

export default connect(mapStateToProps, { getCancelledOrders, getTrades, getAllOrders })(Content);