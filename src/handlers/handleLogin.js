import {
  updateUser,
} from '@folio/stripes/core';

import {
  fetchConsortiaCentralTenant,
  fetchConsortium,
  fetchConsortiumUserTenants,
} from '../services';

export const handleLogin = async (stripes) => {
  const centralTenant = await fetchConsortiaCentralTenant(stripes);
  const consortium = await fetchConsortium(stripes, centralTenant);

  if (consortium) {
    const userTenants = await fetchConsortiumUserTenants(stripes, centralTenant, consortium);

    if (userTenants) {
      const hydratedUserTenants = userTenants
        .map(userTenant => ({
          id: userTenant.tenantId,
          name: userTenant.tenantName,
          isPrimary: userTenant.isPrimary,
        }));

      updateUser(stripes.store, {
        tenants: hydratedUserTenants,
        consortium: {
          id: consortium.id,
          centralTenantId: centralTenant,
        },
      });
    }
  }
};
