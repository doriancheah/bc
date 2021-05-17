import { createSelector } from 'reselect';
import { get, reverse } from 'lodash';
import { ETHER_ADDRESS, fromWei, formatTime } from './helpers';

const RED = 'danger';
const GREEN = 'success';

// input selectors (non-memoized)
export const accountSelector = state => get(state, 'web3.account', 'bologna sandwiches');
export const tokenAddressSelector = state => get(state, 'contracts.token._address');

const tokenLoaded = state => get(state, 'contracts.tokenLoaded', false);
const exchangeLoaded = state => get(state, 'contracts.exchangeLoaded', false);

export const filledOrdersLoadedSelector = state => get(state, 'orders.filledOrders.loaded', false);

const filledOrders = state => get(state, 'orders.filledOrders.data', []);


// memoized selectors
export const contractsLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl, el) => (tl && el)
);

export const filledOrdersSelector = createSelector(filledOrders, orders => {
	const decorated = decorateFilledOrders(orders);
	const sorted = decorated.sort((a, b) => a.timestamp - b.timestamp);
	const colorCoded = colorCode(sorted);
	return reverse([...colorCoded]);
});

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

const decorateFilledOrders = (orders) => {
	let etherAmount, tokenAmount, tokenPrice;
	return (
		orders.map(order => {
			if(order.tokenGive === ETHER_ADDRESS) {
				etherAmount = order.amountGive; // buy order
				tokenAmount = order.amountGet;
			} else {
				etherAmount = order.amountGet;  // sell order
				tokenAmount = order.amountGive;				
			}
			tokenPrice = (etherAmount / tokenAmount).toFixed(5);
			return {...order, 
				eth: fromWei(etherAmount), 
				tok: fromWei(tokenAmount),
				tokPrice: tokenPrice,
				humanTime: formatTime(order.timestamp)
			}
		})
	);
}
