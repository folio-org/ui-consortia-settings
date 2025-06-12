import { lazy } from 'react';

import { PaneBackLink } from '@folio/stripes/components';

import {
  BE_INTERFACE,
  MODULE_ROOT_ROUTE,
} from '../../constants';

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
  Defines the structure of the consortium manager's navigation pane.
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

const {
  ALTERNATIVE_TITLE_TYPES,
  CALL_NUMBER_TYPES,
  CANCELLATION_REASON_STORAGE,
  CLASSIFICATION_TYPES,
  CONTRIBUTOR_TYPES,
  DATA_EXPORT,
  ELECTRONIC_ACCESS_RELATIONSHIPS,
  HOLDINGS_NOTE_TYPES,
  HOLDINGS_SOURCES,
  HOLDINGS_TYPES,
  IDENTIFIERS_TYPES,
  INSTANCE_FORMATS,
  INSTANCE_NOTE_TYPES,
  INSTANCE_STATUSES,
  INSTANCE_TYPES,
  ITEM_NOTE_TYPES,
  LOAN_TYPES,
  MATERIAL_TYPES,
  MODES_OF_ISSUANCE,
  NATURE_OF_CONTENT_TERMS,
  POLICIES,
  ROLES,
  SOURCE_MANAGER_JOB_EXECUTIONS,
  STATISTICAL_CODE_TYPES,
  STATISTICAL_CODES,
  SUBJECT_SOURCES,
  SUBJECT_TYPES,
  USERS,
} = BE_INTERFACE;

/*
  Defines the interfaces required for each module in the consortium manager.
  The `requireAll` property indicates whether all interfaces must be present or if any one of them is sufficient.
 */
export const MODULES_REQUIRED_INTERFACES_MAP = new Map([
  [SETTINGS.authorizationPolicies, {
    interfaces: [POLICIES],
    requireAll: true,
  }],
  [SETTINGS.authorizationRoles, {
    interfaces: [ROLES],
    requireAll: true,
  }],
  [SETTINGS.circulation, {
    interfaces: [CANCELLATION_REASON_STORAGE],
    requireAll: true,
  }],
  [SETTINGS.dataExport, {
    interfaces: [DATA_EXPORT],
    requireAll: true,
  }],
  [SETTINGS.dataImport, {
    interfaces: [SOURCE_MANAGER_JOB_EXECUTIONS],
    requireAll: true,
  }],
  [SETTINGS.inventory, {
    interfaces: [
      ALTERNATIVE_TITLE_TYPES,
      CLASSIFICATION_TYPES,
      CONTRIBUTOR_TYPES,
      INSTANCE_FORMATS,
      INSTANCE_NOTE_TYPES,
      INSTANCE_STATUSES,
      MODES_OF_ISSUANCE,
      NATURE_OF_CONTENT_TERMS,
      IDENTIFIERS_TYPES,
      INSTANCE_TYPES,
      SUBJECT_SOURCES,
      SUBJECT_TYPES,
      HOLDINGS_NOTE_TYPES,
      HOLDINGS_SOURCES,
      HOLDINGS_TYPES,
      ITEM_NOTE_TYPES,
      LOAN_TYPES,
      MATERIAL_TYPES,
      STATISTICAL_CODE_TYPES,
      STATISTICAL_CODES,
      ELECTRONIC_ACCESS_RELATIONSHIPS,
      CALL_NUMBER_TYPES,
    ],
    requireAll: false,
  }],
  [SETTINGS.users, {
    interfaces: [USERS],
    requireAll: false,
  }],
]);

export const MODULES_ROUTES_MAP = AVAILABLE_MODULES.reduce((acc, curr) => {
  return acc.set(curr, lazy(async () => import(`./settings/${curr}/index.js`)));
}, new Map());

export const SETTINGS_BACK_LINKS = Object.entries(SETTINGS).reduce((acc, [key, value]) => {
  acc[key] = <PaneBackLink to={`${MODULE_ROOT_ROUTE}/${value}`} />;

  return acc;
}, {});

export const CONSORTIUM_MANAGER_SECTIONS_PANE_LABEL_ID = 'ui-consortia-settings.consortiumManager.sections.title';
