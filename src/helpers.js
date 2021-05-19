import React from 'react';
import moment from 'moment';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const DECIMALS = (10**18);

export const fromWei = amount => amount / DECIMALS;

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

