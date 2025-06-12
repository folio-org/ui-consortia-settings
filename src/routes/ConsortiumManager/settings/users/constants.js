import sortBy from 'lodash/sortBy';
import { FormattedMessage } from 'react-intl';

import { BE_INTERFACE } from '../../../../constants';
import {
  Departments,
  PatronGroups,
  PermissionSets,
} from './general';

export const SECTION_NAMES = {
  departments: 'departments',
  groups: 'groups',
  perms: 'perms',
};

export const SECTION_PAGES = [
  {
    route: SECTION_NAMES.perms,
    label: <FormattedMessage id="ui-users.settings.permissionSet" />,
    component: PermissionSets,
    perm: 'ui-users.settings.permsets.view',
    isEurekaEnabled: false,
    _interfaces: [BE_INTERFACE.USERS],
  },
  {
    route: SECTION_NAMES.groups,
    label: <FormattedMessage id="ui-users.settings.patronGroups" />,
    component: PatronGroups,
    perm: 'ui-users.settings.usergroups.view',
    isEurekaEnabled: true,
    _interfaces: [BE_INTERFACE.USERS],
  },
  {
    route: SECTION_NAMES.departments,
    label: <FormattedMessage id="ui-users.settings.departments" />,
    component: Departments,
    perm: 'ui-users.settings.departments.view',
    isEurekaEnabled: true,
    _interfaces: [BE_INTERFACE.USERS],
  },
];

export const getSectionPages = (isEureka = false) => {
  if (isEureka) {
    return sortBy(SECTION_PAGES.filter(({ isEurekaEnabled }) => isEurekaEnabled), ['label']);
  }

  return SECTION_PAGES;
};
