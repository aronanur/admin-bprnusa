import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  userReducer,
  responsiveReducer,
  dataMasterReducer,
  dataKontenReducer,
  karirReducer,
  pengajuanKreditReducer,
  dataKontakReducer,
  dataProdukReducer
} from './reducers/index';

const reducers = combineReducers({
  userReducer,
  responsiveReducer,
  dataMasterReducer,
  dataKontenReducer,
  karirReducer,
  pengajuanKreditReducer,
  dataKontakReducer,
  dataProdukReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;