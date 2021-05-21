import { createSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';
import { 
	ETHER_ADDRESS,
	BUY,
	SELL,
	RED,
	GREEN,
	PLUS,
	MINUS, 
	fromWei, 
	formatTime 
} from './helpers';

// input selectors (non-memoized)
const account = state => _.get(state, 'web3.account', '0x0');
const tokenLoaded = state => _.get(state, 'contracts.tokenLoaded', false);
const exchangeLoaded = state => _.get(state, 'contracts.exchangeLoaded', false);
const balances = state => state.balances;

export const filledOrdersLoaded = state => _.get(state, 'orders.filledOrders.loaded', false);
export const cancelledOrdersLoaded = state => _.get(state, 'orders.cancelledOrders.loaded', false);
export const allOrdersLoaded = state => _.get(state, 'orders.allOrders.loaded', false);

const filledOrders = state => _.get(state, 'orders.filledOrders.data', []);
const cancelledOrders = state => _.get(state, 'orders.cancelledOrders.data', []);
const allOrders = state => {
	return _.get(state, 'orders.allOrders.data', []);
};

// memoized selectors
export const balancesSelector = createSelector(balances, bal => {
	return {
		walletEtherBal: fromWei(bal.walletEtherBal).toFixed(3),
		walletTokenBal: fromWei(bal.walletTokenBal).toFixed(2),
		exchangeEtherBal: fromWei(bal.exchangeEtherBal).toFixed(3),
		exchangeTokenBal: fromWei(bal.exchangeTokenBal).toFixed(2),
		loaded: bal.loaded
	}
})


export const contractsLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl, el) => (tl && el)
);

export const orderBookLoadedSelector = createSelector(
	filledOrdersLoaded,
	cancelledOrdersLoaded,
	allOrdersLoaded,
	(f, c, a) => (f && c && a)
);

// All executed orders, placed or filled by user
const myFilledOrdersSelector = createSelector(
	filledOrders, 
	account, 
	(orders, account) => {
		const filtered = _.filter(orders, (o) => {
			return o.user === account || o.userFill === account
		})
	const decorated = filtered.map(order => decorateOrder(order));
	return decorated.sort((a, b) => a.timestamp - b.timestamp);
});

// Further decorated, color-coded and with signed token amounts relative to user's position 
export const myTradesSelector = createSelector(
	myFilledOrdersSelector,
	account,
	(orders, account) => orders.map(o => {
		let sign, color;
		if((o.orderType === BUY && o.user === account) || (o.orderType === SELL && o.userFill === account)) {
			sign = PLUS;
			color = GREEN;
		} else {
			sign = MINUS;
			color = RED;
		}
		return {...o, sign, color};
	})
);

const openOrders = createSelector(
	allOrders,
	filledOrders,
	cancelledOrders,
	(ao, fo, co) => {
		// return items in ao minus those in fo and co...
		const openOrders = _.reject(ao, (order) => {
			const filled = fo.some(o => o.id === order.id);
			const cancelled = co.some(o => o.id === order.id);
			return (filled || cancelled);
		})
		return openOrders.map(order => decorateOrder(order))
	}
);

export const myOpenOrdersSelector = createSelector(
	openOrders,
	account,
	(orders, account) => {
		const filteredSorted = orders.filter(o => o.user === account).sort((a, b) => a.timetamp - b.timestamp);
		return filteredSorted.map(o => {
			const color = o.orderType === BUY ? GREEN : RED;
			return {...o, color};
		})
	}
);

export const filledOrdersSelector = createSelector(filledOrders, orders => {
	const decorated = orders.map(order => decorateOrder(order));
	const sorted = decorated.sort((a, b) => a.timestamp - b.timestamp);
	const colorCoded = colorFilledOrders(sorted);
	return _.reverse([...colorCoded]);
});

export const lastTradeSelector = createSelector(filledOrdersSelector, orders => {
	return _.maxBy(orders, 'timestamp');
})

export const orderBookSelector = createSelector(openOrders, (orders) => {
		const grouped = _.groupBy(orders, 'orderType');
		const buyOrders = _.get(grouped, BUY, []);
		const sellOrders = _.get(grouped, SELL, []);
		return {
			buyOrders: buyOrders.sort((a, b) => a.tokPrice - b.tokPrice),
			sellOrders: sellOrders.sort((a, b) => a.tokPrice - b.tokPrice)
		}
	}
);

export const chartDataSelector = createSelector(filledOrders, orders => {
	const decorated = orders
		.map(order => decorateOrder(order))
		.sort((a, b) => b.timestamp - a.timestamp);
	const grouped = _.groupBy(decorated, order => moment(order.timestamp, 'X').startOf('hour').format());
	const hours = Object.keys(grouped);
	const chartData = hours.map(hour => {
		const open = _.minBy(grouped[hour], 'timestamp').tokPrice;
		const high = _.maxBy(grouped[hour], 'tokPrice').tokPrice;
		const low = _.minBy(grouped[hour], 'tokPrice').tokPrice;
		const close = _.maxBy(grouped[hour], 'timestamp').tokPrice;
		return {
			x: new Date(hour),
			y: [open, high, low, close]
		}
	});
	return chartData;
});

// helpers

// compare with previous trade to show whether price has moved up or down.
const colorFilledOrders = (orders) => {
	let previousPrice = 0, color;
	return (
		orders.map(order => {
			color = order.tokPrice >= previousPrice ? GREEN : RED;
			previousPrice = order.tokPrice;
			return {...order, color: color}
		})
	);
};

const decorateOrder = (order) => {
	let orderType, etherAmount, tokenAmount, tokenPrice;
	if(order.tokenGive === ETHER_ADDRESS) {
		orderType = BUY;
		etherAmount = order.amountGive; // buy order
		tokenAmount = order.amountGet;
	} else {
		orderType = SELL;
		etherAmount = order.amountGet;  // sell order
		tokenAmount = order.amountGive;				
	}
	tokenPrice = (etherAmount / tokenAmount).toFixed(5);
	return {...order, 
		orderType,
		eth: fromWei(etherAmount), 
		tok: fromWei(tokenAmount),
		tokPrice: tokenPrice,
		humanTime: formatTime(order.timestamp)
	}	
}
