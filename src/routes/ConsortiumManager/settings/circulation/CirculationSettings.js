import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import { RequestCancellationReasons } from './requests';

const sections = [
  {
    label: <FormattedMessage id="ui-circulation.settings.index.request" />,
    pages: [
      {
        route: 'cancellation-reasons',
        label: <FormattedMessage id="ui-circulation.settings.index.requestCancellationReasons" />,
        component: RequestCancellationReasons,
        perm: 'ui-circulation.settings.cancellation-reasons',
      },
    ],
  },
];

const CirculationSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={sections}
      paneTitle={<FormattedMessage id="ui-circulation.settings.index.paneTitle" />}
      paneBackLink={MODULE_ROOT_ROUTE}
    />
  );
};

CirculationSettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default CirculationSettings;
