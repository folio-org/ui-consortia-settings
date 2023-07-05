import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import {
  HoldingsNoteTypes,
} from './holdings';
import {
  AlternativeTitleTypes,
  ClassificationTypes,
  ContributorTypes,
  Formats,
} from './instances';

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
      {
        route: 'classificationTypes',
        label: <FormattedMessage id="ui-inventory.classificationIdentifierTypes" />,
        component: ClassificationTypes,
        perm: 'ui-inventory.settings.classification-types',
      },
      {
        route: 'contributortypes',
        label: <FormattedMessage id="ui-inventory.contributorTypes" />,
        component: ContributorTypes,
        perm: 'ui-inventory.settings.contributor-types',
      },
      {
        route: 'formats',
        label: <FormattedMessage id="ui-inventory.formats" />,
        component: Formats,
        perm: 'ui-inventory.settings.instance-formats',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-inventory.holdings" />,
    pages: [
      {
        route: 'holdingsNoteTypes',
        label: <FormattedMessage id="ui-inventory.holdingsNoteTypes" />,
        component: HoldingsNoteTypes,
        perm: 'ui-inventory.settings.holdings-note-types',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-inventory.items" />,
    pages: [],
  },
  {
    label: <FormattedMessage id="ui-inventory.instanceHoldingsItem" />,
    pages: [],
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
