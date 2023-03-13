import { combineReducers } from 'redux';
import { reduce as workerListReducer } from './reducer';

// Register your redux store under a unique namespace
export const namespace = 'agent-admin';

// Combine the reducers
export default combineReducers({
  workerList: workerListReducer
});
