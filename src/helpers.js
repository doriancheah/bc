import moment from 'moment';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const DECIMALS = (10**18);

export const fromWei = amount => amount / DECIMALS;

export const formatTime = (timestamp) => moment.unix(timestamp).format('h:mm:ss a M/D');
