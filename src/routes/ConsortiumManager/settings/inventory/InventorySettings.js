import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

const InventorySettings = (props) => {
  return (
    <Settings
      {...props}
      sections={[]}
      paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
    />
  );
};

InventorySettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default InventorySettings;
