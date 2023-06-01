import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

const DataExportSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={[]}
      paneTitle={<FormattedMessage id="ui-data-export.settings.index.paneTitle" />}
    />
  );
};

DataExportSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default DataExportSettings;
