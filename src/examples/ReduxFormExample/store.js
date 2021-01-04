import { compose, createStore } from 'redux';

import reducer from './reducer';

const store = () => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(reducer, composeEnhancers());

  return store;
};

export default store;
