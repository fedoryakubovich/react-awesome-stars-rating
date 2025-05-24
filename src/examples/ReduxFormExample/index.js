import React from 'react';
import { Provider } from 'react-redux';

import Form from './formContainer';
import createStore from './store';

const store = createStore();

const ReduxFormExample = () => {
  return (
    <Provider store={store}>
      <Form />
    </Provider>
  );
};

export default ReduxFormExample;
