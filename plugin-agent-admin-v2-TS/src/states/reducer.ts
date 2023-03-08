import { WorkerItem, WorkerListState, Action } from "./types";

export const ACTION_SET_WORKERS = "SET_WORKERS";

const initialState = {
  workers: undefined,
};

// Define plugin actions
export class Actions {
  static setWorkers = (workers: Array<WorkerItem>) => ({
    type: ACTION_SET_WORKERS,
    workers
  });
}

// Define how actions influence state
export function reduce(state = initialState, action: Action): WorkerListState {
  switch (action.type) {
    case ACTION_SET_WORKERS:
      return {
        ...state,
        //workers: action.workers,
        ...action
      };
    
    default:
      return state;
  }

};
