import orderBy from 'lodash/orderBy';

import {
  CONTENT_TYPE_HEADER,
  OKAPI_TENANT_HEADER,
} from '../constants';
import { getLegacyTokenHeader } from '../utils';

export const fetchConsortiaCentralTenant = ({ okapi }) => {
  return fetch(`${okapi.url}/consortia-configuration`, {
    credentials: 'include',
    headers: {
      [OKAPI_TENANT_HEADER]: okapi.tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
      ...getLegacyTokenHeader(okapi),
    },
  })
    .then(resp => resp.json())
    .then(data => {
      return data?.centralTenantId || okapi.tenant;
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
  return fetch(`${okapi.url}/consortia/${consortiumId}/_self`, {
    credentials: 'include',
    headers: {
      [OKAPI_TENANT_HEADER]: tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
      ...getLegacyTokenHeader(okapi),
    },
  })
    .then(resp => resp.json())
    .then(data => orderBy(data.userTenants || [], 'tenantName'));
};
