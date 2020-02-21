import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import downloadReducer from './reducers/download'

const rootReducer = combineReducers({
  download: downloadReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
)

export default store
