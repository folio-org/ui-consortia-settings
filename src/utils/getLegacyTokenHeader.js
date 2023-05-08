import { OKAPI_TOKEN_HEADER } from '../constants';

/*
  Provide okapi token, if it exist, as request header
  until refresh token rotation (RTR) flow finally completed.
*/
export const getLegacyTokenHeader = (okapi = {}) => {
  return okapi.token ? { [OKAPI_TOKEN_HEADER]: okapi.token } : {};
};
