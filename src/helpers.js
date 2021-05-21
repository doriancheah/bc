import React from 'react';
import moment from 'moment';
import web3 from 'web3';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const RED = 'danger';
export const GREEN = 'success';
export const BUY = 'buy';
export const SELL = 'sell';
export const PLUS = '+';
export const MINUS = '-';

const DECIMALS = (10**18);

export const fromWei = amount => amount / DECIMALS;

export const toWei = n => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))

export const formatTime = (timestamp) => moment.unix(timestamp).format('h:mm:ss a M/D');

// from Eric Elliott: https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea
export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

export const caretUp = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill text-success" viewBox="0 0 16 16">
		  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
		</svg>
	);
}

export const caretDown = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill text-danger" viewBox="0 0 16 16">
		  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
		</svg>
	);
}

export const arrowLeft = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
		  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
		</svg>
	);
};

export const arrowRight = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
		  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
		</svg>	
	);
};