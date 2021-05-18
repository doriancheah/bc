import moment from 'moment';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const DECIMALS = (10**18);

export const fromWei = amount => amount / DECIMALS;

export const formatTime = (timestamp) => moment.unix(timestamp).format('h:mm:ss a M/D');

// from Eric Elliott: https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea
export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);