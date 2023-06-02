import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

const DataImportSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={[]}
      paneTitle={<FormattedMessage id="ui-data-import.settings.index.paneTitle" />}
    />
  );
};

DataImportSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default DataImportSettings;
