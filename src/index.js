import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
//import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import reducers from './reducers';
// import configureStore from './store/configureStore';



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//const loggerMiddleware = createLogger();
//const middleware = [thunk];

const store = createStore(
	reducers,
	//composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
	composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
	<Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
);


