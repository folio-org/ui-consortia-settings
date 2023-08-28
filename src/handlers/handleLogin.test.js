import { updateUser } from '@folio/stripes/core';

import { tenants } from 'fixtures';
import {
  fetchConsortiaCentralTenant,
  fetchConsortium,
  fetchConsortiumUserTenants,
} from '../services';
import { handleLogin } from './handleLogin';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  updateUser: jest.fn(),
}));
jest.mock('../services', () => ({
  fetchConsortiaCentralTenant: jest.fn(),
  fetchConsortium: jest.fn(),
  fetchConsortiumUserTenants: jest.fn(),
}));

const stripes = {
  store: {},
};
const centralTenantId = 'central';
const consortium = {
  id: 'consortiumId',
  centralTenantId,
};
const userAffiliations = tenants.map(({ id, name }, i) => ({
  tenantId: id,
  tenantName: name,
  isPrimary: i === 0,
}));

describe('handleLogin', () => {
  beforeEach(() => {
    fetchConsortiaCentralTenant.mockClear().mockReturnValue(centralTenantId);
    fetchConsortium.mockClear().mockReturnValue(consortium);
    fetchConsortiumUserTenants.mockClear().mockReturnValue(userAffiliations);
  });

  it('should call updateUser to update consortium data and persist it in a session', async () => {
    await handleLogin(stripes);

    expect(updateUser).toHaveBeenCalledWith(
      stripes.store,
      expect.objectContaining({
        consortium,
        tenants: tenants.map((tenant, i) => ({ ...tenant, isPrimary: i === 0 })),
      }),
    );
  });
});
