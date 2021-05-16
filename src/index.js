import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';

import App from './components/App';
import reducers from './reducers';
// import configureStore from './store/configureStore';

import 'bootstrap/dist/css/bootstrap.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();
const middleware = [thunk];

const store = createStore(
	reducers,
	composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
);

ReactDOM.render(
	<Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
);


