import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../../constants';

export const useTenantKy = ({ tenantId }) => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const tenant = tenantId || stripes.okapi.tenant;

  return ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set(OKAPI_TENANT_HEADER, tenant);
        },
      ],
    },
  });
};
