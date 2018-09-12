import { FETCH_HISTORY } from "./types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_HISTORY:
      const tallies = {};
      const filtered = Object.keys(action.payload.data.history)
        .filter(
          match =>
            Object.values(action.payload.data.history[match].results).length >=
            3
        )
        .map(key => {
          return { id: key, results: action.payload.data.history[key].results };
        });
      for (let i = 0; i < filtered.length; i++) {
        const highScore = Math.max(...Object.values(filtered[i].results));
        for (const player in filtered[i].results) {
          if (filtered[i].results[player] === highScore.toString()) {
            tallies[player] ? tallies[player]++ : (tallies[player] = 1);
          }
        }
      }
      return {
        matches: Object.keys(action.payload.data.history)
          .filter(
            match =>
              Object.values(action.payload.data.history[match].results)
                .length >= 3
          )
          .map(key => {
            return {
              id: key,
              date: action.payload.data.history[key].period,
              results: action.payload.data.history[key].results
            };
          }),
        lastUpdated: action.payload.data.lastUpdated,
        tallies: tallies
      };
    default:
      return state;
  }
}
