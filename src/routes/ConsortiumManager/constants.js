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

export const AVAILABLE_MODULES = [
  SETTINGS.authorizationPolicies,
  SETTINGS.authorizationRoles,
  SETTINGS.circulation,
  SETTINGS.dataExport,
  SETTINGS.dataImport,
  SETTINGS.inventory,
  SETTINGS.users,
];

export const CONSORTIUM_MANAGER_SECTIONS = {
  settings: 'settings',
  logsAndReports: 'logsAndReports',
};

export const CONSORTIUM_MANAGER_SECTIONS_LABEL_IDS_MAP = Object.values(CONSORTIUM_MANAGER_SECTIONS).reduce(
  (acc, section) => acc.set(section, `ui-consortia-settings.consortiumManager.sections.section.${section}`),
  new Map(),
);

/*
  Defines the structure of the consortium manager's left pane
*/
export const CONSORTIUM_MANAGER_SECTIONS_MAP = new Map([
  [CONSORTIUM_MANAGER_SECTIONS.settings, [
    SETTINGS.authorizationPolicies,
    SETTINGS.authorizationRoles,
    SETTINGS.circulation,
    SETTINGS.inventory,
    SETTINGS.users,
  ]],
  [CONSORTIUM_MANAGER_SECTIONS.logsAndReports, [
    SETTINGS.dataExport,
    SETTINGS.dataImport,
  ]],
]);

export const MODULES_ROUTES_MAP = AVAILABLE_MODULES.reduce((acc, curr) => {
  return acc.set(curr, lazy(async () => import(`./settings/${curr}/index.js`)));
}, new Map());

export const SETTINGS_BACK_LINKS = Object.entries(SETTINGS).reduce((acc, [key, value]) => {
  acc[key] = <PaneBackLink to={`${MODULE_ROOT_ROUTE}/${value}`} />;

  return acc;
}, {});

export const CONSORTIUM_MANAGER_SECTIONS_PANE_LABEL_ID = 'ui-consortia-settings.consortiumManager.sections.title';
