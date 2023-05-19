import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  OKAPI_TENANT_HEADER,
  OKAPI_TOKEN_HEADER,
} from '../constants';
import {
  fetchConsortiaCentralTenant,
  fetchConsortium,
  fetchConsortiumMembers,
  fetchConsortiumUserTenants,
} from './consortiaService';

const token = 'qwerty123';
const defaultOkapiUrl = 'https://example.org';
const defaultOkapiTenant = 'diku';

const stripes = {
  okapi: {
    url: defaultOkapiUrl,
    tenant: defaultOkapiTenant,
    token,
    currentUser: {
      id: 'user-id',
      username: 'test_user',
    },
  },
};

const centralTenantResponse = {
  id: 'config-id',
  centralTenantId: 'centralTenantId',
};
const consortiaResponse = {
  consortia: [{
    id: 'consortium-id',
    name: 'MOBIUS',
  }],
  totalRecords: 1,
};
const consortiumTenantsResponse = {
  tenants: [
    { id: 'diku', name: 'Institutional tenant' },
  ],
};
const consortiumUserAffiliationsResponse = {
  userTenants: [
    {
      id: 'affiliation-id',
      tenantId: consortiumTenantsResponse.tenants[0].id,
      tenantName: consortiumTenantsResponse.tenants[0].name,
      userId: stripes.okapi.currentUser.id,
      username: stripes.okapi.currentUser.username,
      isPrimary: true,
    },
  ],
};

const nativeFetch = global.fetch;

// fetch success: resolve promise with ok == true and $data in json()
const mockFetchSuccess = (data) => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    });
  });
};

// restore default fetch impl
const mockFetchCleanUp = () => {
  global.fetch.mockClear();
  global.fetch = nativeFetch;
};

describe('consortiaService', () => {
  describe('fetchConsortiaCentralTenant', () => {
    it('should fetch central tenant ID for the current consortium', async () => {
      mockFetchSuccess(centralTenantResponse);

      const response = await fetchConsortiaCentralTenant(stripes);

      expect(global.fetch).toBeCalledWith(
        `${defaultOkapiUrl}/consortia-configuration`,
        {
          credentials: 'include',
          headers: expect.objectContaining({
            [OKAPI_TENANT_HEADER]: defaultOkapiTenant,
          }),
        },
      );
      expect(response).toEqual(centralTenantResponse.centralTenantId);
      mockFetchCleanUp();
    });
  });

  describe('fetchConsortium', () => {
    it('should fetch consortium data', async () => {
      mockFetchSuccess(consortiaResponse);

      const response = await fetchConsortium(stripes, defaultOkapiTenant);

      expect(global.fetch).toBeCalledWith(
        `${defaultOkapiUrl}/consortia`,
        {
          headers: expect.objectContaining({
            [OKAPI_TENANT_HEADER]: defaultOkapiTenant,
          }),
        },
      );
      expect(response).toEqual(consortiaResponse.consortia[0]);
      mockFetchCleanUp();
    });
  });

  describe('fetchConsortiumMembers', () => {
    it('should fetch consortium members (tenants) - user is not logged in', async () => {
      mockFetchSuccess({
        ...consortiaResponse,
        ...consortiumTenantsResponse,
      });

      const response = await fetchConsortiumMembers(stripes, defaultOkapiTenant);

      expect(global.fetch).toHaveBeenLastCalledWith(
        `${defaultOkapiUrl}/consortia/${consortiaResponse.consortia[0].id}/tenants?limit=${LIMIT_MAX}`,
        {
          headers: expect.objectContaining({
            [OKAPI_TENANT_HEADER]: defaultOkapiTenant,
          }),
        },
      );
      expect(response).toEqual(consortiumTenantsResponse.tenants);
      mockFetchCleanUp();
    });

    it('should fetch consortium members (tenants) - user already logged in', async () => {
      mockFetchSuccess(consortiumTenantsResponse);

      const _stripes = {
        ...stripes,
        user: {
          user: {
            consortium: {
              id: 'consortium-id',
              centralTenantId: 'central-tenant-id',
            },
          },
        },
      };

      const response = await fetchConsortiumMembers(_stripes, defaultOkapiTenant);

      expect(global.fetch).toBeCalledWith(
        `${defaultOkapiUrl}/consortia/${_stripes.user.user.consortium.id}/tenants?limit=${LIMIT_MAX}`,
        {
          headers: expect.objectContaining({
            [OKAPI_TENANT_HEADER]: _stripes.user.user.consortium.centralTenantId,
          }),
        },
      );
      expect(response).toEqual(consortiumTenantsResponse.tenants);
      mockFetchCleanUp();
    });
  });

  describe('fetchConsortiumUserTenants', () => {
    it('should fetch and return affiliations between user and consortium tenants', async () => {
      mockFetchSuccess(consortiumUserAffiliationsResponse);

      const consortiumId = consortiaResponse.consortia[0].id;
      const response = await fetchConsortiumUserTenants(stripes, defaultOkapiTenant, { id: consortiumId });

      expect(global.fetch).toBeCalledWith(
        `${defaultOkapiUrl}/consortia/consortium-id/_self`,
        {
          credentials: 'include',
          headers: expect.objectContaining({
            [OKAPI_TENANT_HEADER]: defaultOkapiTenant,
            [OKAPI_TOKEN_HEADER]: token,
          }),
        },
      );
      expect(response).toEqual(consortiumUserAffiliationsResponse.userTenants);
      mockFetchCleanUp();
    });
  });
});
