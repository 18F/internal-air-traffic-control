import { combineReducers } from 'redux';
import flights from './flights';

const app = combineReducers({
  flights: flights
});

export default app;
