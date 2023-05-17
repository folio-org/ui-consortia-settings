import orderBy from 'lodash/orderBy';

import { LIMIT_MAX } from '@folio/stripes-acq-components';

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

export const fetchConsortiumMembers = async ({ okapi, user }) => {
  const consortium = user?.user?.consortium || await fetchConsortium({ okapi }, okapi.tenant);

  return fetch(`${okapi.url}/consortia/${consortium.id}/tenants?limit=${LIMIT_MAX}`, {
    headers: {
      [OKAPI_TENANT_HEADER]: okapi.tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
    },
  })
    .then(resp => resp.json())
    .then(data => orderBy(data.tenants || [], 'name'));
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
