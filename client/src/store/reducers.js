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
            if (tallies[player]) {
              tallies[player].data = {
                ...tallies[player].data,
                wins: tallies[player].wins
                  ? tallies[player].wins++
                  : (tallies[player].wins = 1),
                played: tallies[player].played
                  ? tallies[player].played++
                  : (tallies[player].played = 1)
              };
            } else {
              tallies[player] = {
                wins: 1,
                played: 1
              };
            }
          } else {
            if (tallies[player]) {
              tallies[player].data = {
                ...tallies[player].data,
                played: tallies[player].played
                  ? tallies[player].played++
                  : (tallies[player].played = 1)
              };
            } else {
              tallies[player] = {
                played: 1
              };
            }
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
        tallies: Object.keys(tallies).map(user => {
          return {
            user: user,
            data: { wins: tallies[user].wins, played: tallies[user].played }
          };
        })
      };
    default:
      return state;
  }
}
