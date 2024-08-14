import { lazy } from 'react';

import { PaneBackLink } from '@folio/stripes/components';

import { MODULE_ROOT_ROUTE } from '../../constants';

export const SETTINGS = {
  authorizationPolicies: 'authorization-policies',
  authorizationRoles: 'authorization-roles',
  circulation: 'circulation',
  dataExport: 'data-export',
  dataImport: 'data-import',
  inventory: 'inventory',
  users: 'users',
};

export const AVAILABLE_SETTINGS = [
  SETTINGS.authorizationPolicies,
  SETTINGS.authorizationRoles,
  SETTINGS.circulation,
  SETTINGS.dataExport,
  SETTINGS.dataImport,
  SETTINGS.inventory,
  SETTINGS.users,
];

export const SETTINGS_ROUTES = AVAILABLE_SETTINGS.reduce((acc, curr) => {
  acc[curr] = lazy(async () => import(`./settings/${curr}/index.js`));

  return acc;
}, {});

export const SETTINGS_BACK_LINKS = Object.entries(SETTINGS).reduce((acc, [key, value]) => {
  acc[key] = <PaneBackLink to={`${MODULE_ROOT_ROUTE}/${value}`} />;

  return acc;
}, {});
