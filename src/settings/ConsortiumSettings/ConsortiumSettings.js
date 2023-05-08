import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { Settings } from '@folio/stripes/smart-components';

import { ConsortiumContextProvider } from '../../ConsortiumContext';
import { eventHandler } from '../../eventHandler';
import { checkConsortiumAffiliations } from '../../utils';
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

class ConsortiumSettings extends React.Component {
  // Checks whether to show "Switch active affiliation" action item in the profile dropdown (package.json::stripes.links.userDropdown[0])
  static checkConsortiumAffiliations = checkConsortiumAffiliations;

  // Implementation of the handler specified in package.json ("stripes.handlerName")
  static eventHandler = eventHandler;

  render() {
    return (
      <ConsortiumContextProvider>
        <CommandList commands={defaultKeyboardShortcuts}>
          <Settings
            {...this.props}
            navPaneWidth="25%"
            paneTitle={<FormattedMessage id="ui-consortia-settings.settings.heading" />}
            sections={sections}
          />
        </CommandList>
      </ConsortiumContextProvider>
    );
  }
}

export default ConsortiumSettings;
