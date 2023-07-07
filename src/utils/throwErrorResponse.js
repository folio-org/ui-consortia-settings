/**
 * Throws the response value from the `HTTPError` instance for subsequent error handling.
 *
 * @param {HTTPError} error
 */
export const throwErrorResponse = (error) => {
  throw error.response;
};
