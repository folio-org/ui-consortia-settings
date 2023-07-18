import { useCallback, useEffect, useState } from 'react';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIA_API,
  PUBLICATIONS_API,
  PUBLISH_COORDINATOR_STATUSES,
} from '../../constants';

const TIMEOUT = 2500;

export const usePublishCoordinator = (options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [isLoading, setIsLoading] = useState(false);
  const [abortController] = useState(new AbortController());

  const consortium = stripes.user?.user?.consortium;
  const signal = options.signal || abortController.signal;
  const baseApi = `${CONSORTIA_API}/${consortium?.id}/${PUBLICATIONS_API}`;

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [abortController]);

  const getPublicationResults = useCallback((id) => {
    return ky.get(`${baseApi}/${id}/results`, { signal }).json();
  }, [signal, baseApi, ky]);

  const getPublicationDetails = useCallback(async (requestId) => {
    const {
      id,
      status,
      request,
      errors,
    } = await ky.get(`${baseApi}/${requestId}`, { signal }).json();

    if (status === PUBLISH_COORDINATOR_STATUSES.ERROR) throw { errors, request };
    if (status === PUBLISH_COORDINATOR_STATUSES.COMPLETE) return getPublicationResults(id);

    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));

    return !abortController.signal.aborted
      ? getPublicationDetails(id)
      : Promise.reject(abortController.signal.reason);
  }, [
    abortController.signal.aborted,
    abortController.signal.reason,
    baseApi,
    getPublicationResults,
    ky,
    signal,
  ]);

  const getPublicationResponse = useCallback(({ id, status }) => {
    if (status === PUBLISH_COORDINATOR_STATUSES.COMPLETE) return getPublicationResults(id);

    return getPublicationDetails(id);
  }, [getPublicationDetails, getPublicationResults]);

  // { url, method, tenants, payload }
  const initPublicationRequest = useCallback((publication) => {
    setIsLoading(true);

    return ky.post(baseApi, { json: publication, signal })
      .json()
      .then(getPublicationResponse)
      .catch(error => (!abortController.signal.aborted ? Promise.reject(error) : Promise.resolve()))
      .finally(() => setIsLoading(false));
  }, [
    abortController.signal.aborted,
    baseApi,
    getPublicationResponse,
    ky,
    signal,
  ]);

  return {
    initPublicationRequest,
    isLoading,
  };
};
