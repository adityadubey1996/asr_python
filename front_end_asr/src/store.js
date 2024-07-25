import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import userReducer from './reducers/auth.reducer';
import questionResucer from './reducers/metric.reducer';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({
    user : userReducer,
    metrics: questionResucer
})

const persistConfig = {
    key: 'root',
    storage,
  }



 const persistorReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer : persistorReducer
})
export const persistor = persistStore(store)
export default store;

