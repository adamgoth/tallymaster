import { FETCH_HISTORY } from "./types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_HISTORY:
      return action.payload.data;
    default:
      return state;
  }
}
