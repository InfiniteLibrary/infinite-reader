import * as types from './actionTypes';

export function login() {
  return {
    type: types.LOGIN
  };
}

export function logout() {
  return {
    type: types.LOGOUT
  };
}