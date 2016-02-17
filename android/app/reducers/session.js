import * as types from '../actions/actionTypes';

const initialState = {
  count: 0
};

export default function session(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        session: true
      };
    case types.LOGOUT:
      return {
        ...state,
        session: false
      };
    default:
      return state;
  }
}