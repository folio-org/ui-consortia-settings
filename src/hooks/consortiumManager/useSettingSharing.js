import { useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIA_API,
  RECORD_SOURCE,
  SETTINGS_SHARING_API,
} from '../../constants';
import { throwErrorResponse } from '../../utils';
import { usePublishCoordinator } from '../usePublishCoordinator';

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

  const initSettingSharingRequest = ({ url, ...setting }, { method, publicationKey }) => {
    abortController.current = new AbortController();
    const signal = options.signal || abortController.current.signal;
    const json = {
      // Publications API requires `url` value to start with slash (`/`)
      url: url.startsWith('/') ? url : `/${url}`,
      ...setting,
    };

    const api = method === 'POST' ? baseApi : `${baseApi}/${setting.settingId}`;

    return ky(api, { method, json, signal })
      .json()
      .then(res => getPublicationDetails(res[publicationKey], { signal }))
      .catch(throwErrorResponse);
  };

  const {
    mutateAsync: upsertSharedSetting,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const settingId = entry.id || uuidv4();
      const publication = {
        settingId,
        url: path,
        payload: {
          ...entry,
          id: settingId,
        },
      };
      const isShared = entry.source === RECORD_SOURCE.CONSORTIUM;

      return initSettingSharingRequest(
        publication,
        {
          method: 'POST',
          publicationKey: isShared ? 'updateSettingsPCId' : 'createSettingsPCId',
        },
      );
    },
  });

  const {
    mutateAsync: deleteSharedSetting,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const publication = {
        settingId: entry.id,
        url: `${path}/${entry.id}`,
      };

      // TODO: implement creation of a shared setting
      return Promise.reject(new Error('Not implemented yet'));

      // return initSettingSharingRequest(publication, { method: 'DELETE', publicationKey: 'pcId' });
    },
  });

  return {
    upsertSharedSetting,
    deleteSharedSetting,
  };
};
