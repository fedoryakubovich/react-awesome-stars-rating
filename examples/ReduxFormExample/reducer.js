import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const reducer = combineReducers({
  form: formReducer,
});

export default reducer;
