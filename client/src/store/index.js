import { combineReducers } from "redux";
import historyReducer from "./reducers";

const store = combineReducers({
  history: historyReducer
});

export default store;
