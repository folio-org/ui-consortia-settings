import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

const CirculationSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={[]}
      paneTitle={<FormattedMessage id="ui-circulation.settings.index.paneTitle" />}
    />
  );
};

CirculationSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default CirculationSettings;
