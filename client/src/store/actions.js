import axios from "axios";
import { FETCH_HISTORY } from "./types";

const root =
  window.location.hostname === "localhost" ? "http://localhost:3001" : "";

export function fetchHistory() {
  const url = `${root}/history`;
  const request = axios.get(`${url}`);

  return {
    type: FETCH_HISTORY,
    payload: request
  };
}
