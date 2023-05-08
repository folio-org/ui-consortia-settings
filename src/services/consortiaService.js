import {
  CONTENT_TYPE_HEADER,
  OKAPI_TENANT_HEADER,
} from '../constants';
import { getLegacyTokenHeader } from '../utils';

export const fetchConsortiaCentralTenant = ({ okapi }) => {
  const searchParams = new URLSearchParams({
    query: '(module=CONSORTIA and configName=centralTenantId)',
  });

  return fetch(`${okapi.url}/configurations/entries?${searchParams}`, {
    credentials: 'include',
    headers: {
      [OKAPI_TENANT_HEADER]: okapi.tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
      ...getLegacyTokenHeader(okapi),
    },
  })
    .then(resp => resp.json())
    .then(data => {
      return data.configs[0]?.value || okapi.tenant;
    });
};

export const fetchConsortium = ({ okapi }, tenant) => {
  return fetch(`${okapi.url}/consortia`, {
    headers: {
      [OKAPI_TENANT_HEADER]: tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
    },
  })
    .then(resp => resp.json())
    .then(data => data.consortia[0]);
};

export const fetchConsortiumUserTenants = ({ okapi }, tenant, { id: consortiumId }) => {
  return fetch(`${okapi.url}/consortia/${consortiumId}/user-tenants?userId=${okapi.currentUser.id}`, {
    credentials: 'include',
    headers: {
      [OKAPI_TENANT_HEADER]: tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
      ...getLegacyTokenHeader(okapi),
    },
  })
    .then(resp => resp.json())
    .then(data => data.userTenants);
};
