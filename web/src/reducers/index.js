import { combineReducers } from 'redux';
import flights from './flights';
import statuses from './statuses';

const app = combineReducers({
  flights,
  statuses
});

export default app;
