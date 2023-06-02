import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

const UsersSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={[]}
      paneTitle={<FormattedMessage id="ui-users.settings.label" />}
    />
  );
};

UsersSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default UsersSettings;
