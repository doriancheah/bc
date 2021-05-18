import { createSelector } from 'reselect';
import _ from 'lodash';
import { ETHER_ADDRESS, fromWei, formatTime } from './helpers';

const RED = 'danger';
const GREEN = 'success';
const BUY = 'buy';
const SELL = 'sell';
const PLUS = '+';
const MINUS = '-';

// input selectors (non-memoized)
const account = state => _.get(state, 'web3.account', '0x0');
const tokenLoaded = state => _.get(state, 'contracts.tokenLoaded', false);
const exchangeLoaded = state => _.get(state, 'contracts.exchangeLoaded', false);

export const filledOrdersLoaded = state => _.get(state, 'orders.filledOrders.loaded', false);
export const cancelledOrdersLoaded = state => _.get(state, 'orders.cancelledOrders.loaded', false);
export const allOrdersLoaded = state => _.get(state, 'orders.allOrders.loaded', false);

const filledOrders = state => _.get(state, 'orders.filledOrders.data', []);
const cancelledOrders = state => _.get(state, 'orders.cancelledOrders.data', []);
const allOrders = state => {
	console.log('reselect allOrders');
	return _.get(state, 'orders.allOrders.data', []);
};

// memoized selectors
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

export const filledOrdersSelector = createSelector(filledOrders, orders => {
	const decorated = orders.map(order => decorateOrder(order));
	const sorted = decorated.sort((a, b) => a.timestamp - b.timestamp);
	const colorCoded = colorCode(sorted);
	return _.reverse([...colorCoded]);
});

export const orderBookSelector = createSelector(
	allOrders,
	filledOrders,
	cancelledOrders,
	(ao, fo, co) => {
		console.log('calculating open orders');
		// return items in ao minus those in fo and co...
		const openOrders = _.reject(ao, (order) => {
			const filled = fo.some(o => o.id === order.id);
			const cancelled = co.some(o => o.id === order.id);
			return (filled || cancelled);
		})
		const decorated = openOrders.map(order => decorateOrder(order));
		const grouped = _.groupBy(decorated, 'orderType');
		const buyOrders = _.get(grouped, BUY, []);
		const sellOrders = _.get(grouped, SELL, []);
		return {
			buyOrders: buyOrders.sort((a, b) => a.tokPrice - b.tokPrice),
			sellOrders: sellOrders.sort((a, b) => a.tokPrice - b.tokPrice)
		}
	} 
)

// helpers
const colorCode = (orders) => {
	let previousPrice = 0, color;
	return (
		orders.map(order => {
			color = order.tokPrice >= previousPrice ? GREEN : RED;
			previousPrice = order.tokPrice;
			return {...order, color: color}
		})
	);
}

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
