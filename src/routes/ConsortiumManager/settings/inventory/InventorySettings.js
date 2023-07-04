import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { AlternativeTitleTypes } from './instances';

const sections = [
  {
    label: <FormattedMessage id="ui-inventory.instances" />,
    pages: [
      {
        route: 'alternativeTitleTypes',
        label: <FormattedMessage id="ui-inventory.alternativeTitleTypes" />,
        component: AlternativeTitleTypes,
        perm: 'ui-inventory.settings.alternative-title-types',
      },
    ],
  },
];

const InventorySettings = (props) => {
  return (
    <Settings
      {...props}
      sections={sections}
      paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
    />
  );
};

InventorySettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default InventorySettings;
