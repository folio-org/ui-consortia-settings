import { useOkapiKy } from '@folio/stripes/core';

import { extendKyWithTenant } from '../../utils';

export const useTenantKy = ({ tenantId } = {}) => {
  const ky = useOkapiKy();

  return tenantId ? extendKyWithTenant(ky, tenantId) : ky;
};
