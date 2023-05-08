import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  CONFIGURATIONS_ENTRIES_API,
  CONSORTIA_API,
  OKAPI_TENANT_HEADER,
} from '../../constants';

const MODULE_NAME = 'CONSORTIA';
const CONFIG_NAME = 'centralTenantId';

export const useCurrentConsortium = () => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const configsSearchParams = {
    limit: LIMIT_MAX,
    query: `(module=${MODULE_NAME} and configName=${CONFIG_NAME})`,
  };

  const enabled = Boolean(
    stripes.hasInterface('consortia') && stripes.hasPerm('consortia.consortium.collection.get'),
  );

  const { isLoading, data } = useQuery(
    ['consortium'],
    async () => {
      const { configs } = await ky.get(
        CONFIGURATIONS_ENTRIES_API,
        { searchParams: configsSearchParams },
      ).json();

      const centralTenant = configs[0]?.value;

      if (!centralTenant) return Promise.resolve();

      const api = ky.extend({
        hooks: {
          beforeRequest: [
            request => {
              request.headers.set(OKAPI_TENANT_HEADER, centralTenant);
            },
          ],
        },
      });

      const { consortia } = await api.get(CONSORTIA_API).json();

      if (consortia?.length) {
        const [consortium] = consortia;

        return {
          ...consortium,
          centralTenant,
        };
      }

      return Promise.resolve({ centralTenant });
    },
    { enabled },
  );

  return ({
    consortium: data,
    isLoading,
  });
};
