import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { ConsortiumContextProvider } from '../../contexts';
import { CentralOrdering } from '../CentralOrdering';
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
  {
    label: <FormattedMessage id="ui-consortia-settings.settings.section.networkOrdering" />,
    pages: [
      {
        component: CentralOrdering,
        label: <FormattedMessage id="ui-consortia-settings.settings.centralOrdering.label" />,
        route: 'central-ordering',
        perm: 'ui-consortia-settings.settings.networkOrdering.view',
      },
    ],
  },
];

class ConsortiumSettings extends React.Component {
  render() {
    return (
      <ConsortiumContextProvider>
        <CommandList commands={defaultKeyboardShortcuts}>
          <IntlConsumer>
            {intl => <TitleManager page={intl.formatMessage({ id: 'ui-consortia-settings.document.settings.title' })} />}
          </IntlConsumer>
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
