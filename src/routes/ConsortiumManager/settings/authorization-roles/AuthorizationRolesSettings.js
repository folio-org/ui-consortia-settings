import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import { CapabilitiesCompare } from './Cabalities/CapabilitiesCompare/CapablitiesCompare';

const sections = [
  {
    label: <FormattedMessage id="ui-authorization-roles.meta.title" />,
    pages: [
      {
        route: 'capabilities',
        label: <FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare" />,
        component: CapabilitiesCompare,
        // perm: 'ui-authorization-roles.permission.settings.admin',
      },
    ],
  },
];

const AuthorizationRolesSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={sections}
      paneTitle={<FormattedMessage id="ui-authorization-roles.meta.title" />}
      paneBackLink={MODULE_ROOT_ROUTE}
    />
  );
};

AuthorizationRolesSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default AuthorizationRolesSettings;
