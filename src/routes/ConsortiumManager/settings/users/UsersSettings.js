import sortBy from 'lodash/sortBy';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import {
  Departments,
  PatronGroups,
  PermissionSets,
} from './general';

const sections = [
  {
    label: <FormattedMessage id="ui-users.settings.general" />,
    pages: sortBy([
      {
        route: 'perms',
        label: <FormattedMessage id="ui-users.settings.permissionSet" />,
        component: PermissionSets,
        perm: 'ui-users.settings.permsets.view',
      },
      {
        route: 'groups',
        label: <FormattedMessage id="ui-users.settings.patronGroups" />,
        component: PatronGroups,
        perm: 'ui-users.settings.usergroups.view',
      },
      {
        route: 'departments',
        label: <FormattedMessage id="ui-users.settings.departments" />,
        component: Departments,
        perm: 'ui-users.settings.departments.view',
      },
    ], ['label']),
  },
];

const UsersSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={sections}
      paneTitle={<FormattedMessage id="ui-users.settings.label" />}
    />
  );
};

UsersSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default UsersSettings;
