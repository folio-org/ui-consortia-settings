import { FormattedMessage } from 'react-intl';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { Settings } from '@folio/stripes/smart-components';

import { Membership } from '../Membership';

const sections = [
  {
    label: <FormattedMessage id="ui-consortia-settings.settings.section.general" />,
    pages: [
      {
        component: Membership,
        label: <FormattedMessage id="ui-consortia-settings.settings.membership.label" />,
        route: 'membership',
        perm: 'ui-consortia-settings.settings.membership.view',
      },
    ],
  },
];

const ConsortiumSettings = ({ ...props }) => {
  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <Settings
        {...props}
        navPaneWidth="25%"
        paneTitle={<FormattedMessage id="ui-consortia-settings.settings.heading" />}
        sections={sections}
      />
    </CommandList>
  );
};

export default ConsortiumSettings;
