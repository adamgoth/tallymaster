import { FETCH_HISTORY } from "./types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_HISTORY:
      return {
        matches: Object.keys(action.payload.data.history)
          .filter(
            match =>
              Object.values(action.payload.data.history[match]).length >= 3
          )
          .map(key => {
            return { id: key, results: action.payload.data.history[key] };
          }),
        lastUpdated: action.payload.data.lastUpdated
      };
    default:
      return state;
  }
}
