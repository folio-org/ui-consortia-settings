import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import { isEurekaEnabled } from '../../../../utils';
import { getSectionPages } from './constants';

const UsersSettings = (props) => {
  const isEureka = isEurekaEnabled(props.stripes);

  const sections = useMemo(() => [{
    label: <FormattedMessage id="ui-users.settings.general" />,
    pages: getSectionPages(isEureka),
  }], [isEureka]);

  return (
    <Settings
      {...props}
      sections={sections}
      paneTitle={<FormattedMessage id="ui-users.settings.label" />}
      paneBackLink={MODULE_ROOT_ROUTE}
    />
  );
};

UsersSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default UsersSettings;
