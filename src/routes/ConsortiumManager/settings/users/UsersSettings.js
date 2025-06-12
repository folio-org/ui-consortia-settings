import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import { isEurekaEnabled } from '../../../../utils';
import { filterSectionsByInterfaces } from '../../utils';
import { getSectionPages } from './constants';

const UsersSettings = ({ stripes, ...props }) => {
  const isEureka = isEurekaEnabled(stripes);

  const sections = useMemo(() => filterSectionsByInterfaces(
    stripes,
    [{
      label: <FormattedMessage id="ui-users.settings.general" />,
      pages: getSectionPages(isEureka),
    }],
  ), [isEureka, stripes]);

  return (
    <Settings
      {...props}
      sections={sections}
      stripes={stripes}
      paneTitle={<FormattedMessage id="ui-users.settings.label" />}
      paneBackLink={MODULE_ROOT_ROUTE}
    />
  );
};

UsersSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default UsersSettings;
