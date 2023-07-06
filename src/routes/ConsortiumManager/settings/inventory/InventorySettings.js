import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import {
  HoldingsNoteTypes,
  HoldingsTypes,
} from './holdings';
import {
  AlternativeTitleTypes,
  ClassificationTypes,
  ContributorTypes,
  Formats,
  InstanceNoteTypes,
  InstanceStatusTypes,
} from './instances';
import {
  ItemNoteTypes,
  LoanTypes,
  MaterialTypes,
} from './items';

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
      {
        route: 'instanceNoteTypes',
        label: <FormattedMessage id="ui-inventory.instanceNoteTypes" />,
        component: InstanceNoteTypes,
        perm: 'ui-inventory.settings.instance-note-types',
      },
      {
        route: 'instanceStatusTypes',
        label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
        component: InstanceStatusTypes,
        perm: 'ui-inventory.settings.instance-statuses',
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
      {
        route: 'holdingsTypes',
        label: <FormattedMessage id="ui-inventory.holdingsTypes" />,
        component: HoldingsTypes,
        perm: 'ui-inventory.settings.holdings-types',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-inventory.items" />,
    pages: [
      {
        route: 'itemNoteTypes',
        label: <FormattedMessage id="ui-inventory.itemNoteTypes" />,
        component: ItemNoteTypes,
        perm: 'ui-inventory.settings.item-note-types',
      },
      {
        route: 'loantypes',
        label: <FormattedMessage id="ui-inventory.loanTypes" />,
        component: LoanTypes,
        perm: 'ui-inventory.settings.loantypes',
      },
      {
        route: 'materialtypes',
        label: <FormattedMessage id="ui-inventory.materialTypes" />,
        component: MaterialTypes,
        perm: 'ui-inventory.settings.materialtypes',
      },
    ],
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
      paneBackLink={MODULE_ROOT_ROUTE}
    />
  );
};

InventorySettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default InventorySettings;
