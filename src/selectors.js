import { createSelector } from 'reselect';
import { get } from 'lodash';

const account = state => get(state, 'web3.account');

export const accountSelector = createSelector(account, a => a);