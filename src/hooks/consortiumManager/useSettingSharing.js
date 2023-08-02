import { useCallback, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIA_API,
  HTTP_METHODS,
  SETTINGS_SHARING_API,
} from '../../constants';
import { throwErrorResponse } from '../../utils';
import { usePublishCoordinator } from '../usePublishCoordinator';

const PC_SHARE_DETAILS_KEYS = {
  create: 'createSettingsPCId',
  update: 'updateSettingsPCId',
  // TODO: adjust with BE (MODCON-71)
  delete: 'pcId',
};

const getRequestId = (pcDetails, method) => {
  return method === HTTP_METHODS.DELETE
    ? pcDetails[PC_SHARE_DETAILS_KEYS.delete]
    : pcDetails[PC_SHARE_DETAILS_KEYS.update] || pcDetails[PC_SHARE_DETAILS_KEYS.create];
};

export const useSettingSharing = ({ path }, options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const abortController = useRef(new AbortController());

  const { getPublicationDetails } = usePublishCoordinator();

  const consortium = stripes.user?.user?.consortium;
  const baseApi = `${CONSORTIA_API}/${consortium?.id}/${SETTINGS_SHARING_API}`;

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  const initSettingSharingRequest = useCallback(({ url, ...setting }, { method }) => {
    abortController.current = new AbortController();
    const signal = options.signal || abortController.current.signal;
    const json = {
      // Publications API requires `url` value to start with slash (`/`)
      url: url.startsWith('/') ? url : `/${url}`,
      ...setting,
    };

    const api = method === HTTP_METHODS.POST ? baseApi : `${baseApi}/${setting.settingId}`;

    return ky(api, { method, json, signal })
      .json()
      .then(res => getPublicationDetails(getRequestId(res, method), { signal }))
      .catch(throwErrorResponse);
  }, [baseApi, getPublicationDetails, ky, options.signal]);

  const {
    mutateAsync: upsertSharedSetting,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const settingId = entry.id || uuidv4();
      const request = {
        settingId,
        url: path,
        payload: {
          ...entry,
          id: settingId,
        },
      };

      return initSettingSharingRequest(request, { method: HTTP_METHODS.POST });
    },
  });

  const {
    mutateAsync: deleteSharedSetting,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const request = {
        settingId: entry.id,
        url: `${path}/${entry.id}`,
      };

      // TODO: implement creation of a shared setting
      // return initSettingSharingRequest(request, { method: HTTP_METHODS.DELETE });
      return Promise.reject(new Error('Not implemented yet' + JSON.stringify(request)));
    },
  });

  return {
    upsertSharedSetting,
    deleteSharedSetting,
  };
};
