import { useCallback, useEffect, useRef } from 'react';

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

const formatPublicationResult = ({ publicationResults, totalRecords }) => {
  const formattedResults = publicationResults.map(({ response, ...rest }) => ({
    response: JSON.parse(response),
    ...rest,
  }));

  return {
    publicationResults: formattedResults,
    totalRecords,
  };
};

export const usePublishCoordinator = (options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const abortController = useRef(new AbortController());

  const consortium = stripes.user?.user?.consortium;
  const baseApi = `${CONSORTIA_API}/${consortium?.id}/${PUBLICATIONS_API}`;

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  const getPublicationResults = useCallback((id) => {
    const signal = options.signal || abortController.current.signal;

    return ky.get(`${baseApi}/${id}/results`, { signal })
      .json()
      .then(formatPublicationResult);
  }, [options.signal, ky, baseApi]);

  const getPublicationDetails = useCallback(async (requestId) => {
    const signal = options.signal || abortController.current.signal;

    const {
      id,
      status,
      request,
      errors,
    } = await ky.get(`${baseApi}/${requestId}`, { signal }).json();

    if (status === PUBLISH_COORDINATOR_STATUSES.ERROR) throw { errors, request };
    if (status === PUBLISH_COORDINATOR_STATUSES.COMPLETE) return getPublicationResults(id);

    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));

    return !signal.aborted
      ? getPublicationDetails(id)
      : Promise.reject(signal);
  }, [baseApi, getPublicationResults, ky, options.signal]);

  const getPublicationResponse = useCallback(({ id, status }) => {
    if (status === PUBLISH_COORDINATOR_STATUSES.COMPLETE) return getPublicationResults(id);

    return getPublicationDetails(id);
  }, [getPublicationDetails, getPublicationResults]);

  const initPublicationRequest = useCallback(({ url, ...publication }) => {
    abortController.current = new AbortController();
    const signal = options.signal || abortController.current.signal;
    const json = {
      // Publications API requires `url` value to start with slash (`/`)
      url: url.startsWith('/') ? url : `/${url}`,
      ...publication,
    };

    return ky.post(baseApi, { json, signal })
      .json()
      .then(getPublicationResponse);
  }, [baseApi, getPublicationResponse, ky, options.signal]);

  return {
    initPublicationRequest,
  };
};
