import React from 'react';
import { connect } from 'react-redux';
import Chart from 'react-apexcharts';
import Spinner from './Spinner';
import { chartOptions, dummyData } from '../config/PriceChart.config';
import { chartDataSelector, lastTradeSelector } from '../selectors';
import { caretUp, caretDown } from '../helpers';

class PriceChart extends React.Component {
	renderPriceChart = () => {
		const { chartData } = this.props;
		return (
			<div className="price-chart">
				<div className="price">
					{this.renderPrice()}			
				</div>
				<Chart 
					options={chartOptions}
					series={[{ data: dummyData }]}
					type="candlestick"
					width="100%"
					height="100%"
				/>
			</div>
		);
	};

	renderPrice = () => {
		const { color, tokPrice } = this.props.lastTrade;
		return (
			<h4>
				DORY/ETH&nbsp;{ color === 'success' ? caretUp() : caretDown() }&nbsp;{ tokPrice }
			</h4>
		);
	};

	render() {
		return (
			<div className="card bg-dark text-white">
				<div className="card-header">
					Price Chart
				</div>
				<div className="card-body">
					{this.props.chartData.length ? this.renderPriceChart() : <Spinner />}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		chartData: chartDataSelector(state),
		lastTrade: lastTradeSelector(state)
	};
}

export default connect(mapStateToProps)(PriceChart);