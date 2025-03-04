import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import {
  HoldingsNoteTypes,
  HoldingsSources,
  HoldingsTypes,
} from './holdings';
import { CallNumberTypes } from './holdings-items';
import {
  AlternativeTitleTypes,
  ClassificationTypes,
  ContributorTypes,
  Formats,
  InstanceNoteTypes,
  InstanceStatusTypes,
  ModesOfIssuance,
  NatureOfContentTerms,
  ResourceIdentifierTypes,
  ResourceTypes,
  SubjectSources,
  SubjectTypes,
} from './instances';
import {
  StatisticalCodes,
  StatisticalCodeTypes,
  URLRelationships,
} from './instances-holdings-items';
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
        route: 'alternative-title-types',
        label: <FormattedMessage id="ui-inventory.alternativeTitleTypes" />,
        component: AlternativeTitleTypes,
        perm: 'ui-inventory.settings.alternative-title-types',
      },
      {
        route: 'classification-types',
        label: <FormattedMessage id="ui-inventory.classificationIdentifierTypes" />,
        component: ClassificationTypes,
        perm: 'ui-inventory.settings.classification-types',
      },
      {
        route: 'contributor-types',
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
        route: 'instance-note-types',
        label: <FormattedMessage id="ui-inventory.instanceNoteTypes" />,
        component: InstanceNoteTypes,
        perm: 'ui-inventory.settings.instance-note-types',
      },
      {
        route: 'instance-status-types',
        label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
        component: InstanceStatusTypes,
        perm: 'ui-inventory.settings.instance-statuses',
      },
      {
        route: 'modes-of-issuance',
        label: <FormattedMessage id="ui-inventory.modesOfIssuance" />,
        component: ModesOfIssuance,
        perm: 'ui-inventory.settings.modes-of-issuance',
      },
      {
        route: 'nature-of-content-terms',
        label: <FormattedMessage id="ui-inventory.natureOfContentTerms" />,
        component: NatureOfContentTerms,
        perm: 'ui-inventory.settings.nature-of-content-terms',
      },
      {
        route: 'identifier-types',
        label: <FormattedMessage id="ui-inventory.resourceIdentifierTypes" />,
        component: ResourceIdentifierTypes,
        perm: 'ui-inventory.settings.identifier-types',
      },
      {
        route: 'resource-types',
        label: <FormattedMessage id="ui-inventory.resourceTypes" />,
        component: ResourceTypes,
        perm: 'ui-inventory.settings.instance-types',
      },
      {
        route: 'subject-sources',
        label: <FormattedMessage id="ui-inventory.subjectSources" />,
        component: SubjectSources,
        perm: 'ui-inventory.settings.subject-sources',
      },
      {
        route: 'subject-types',
        label: <FormattedMessage id="ui-inventory.subjectTypes" />,
        component: SubjectTypes,
        perm: 'ui-inventory.settings.subject-types',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-inventory.holdings" />,
    pages: [
      {
        route: 'holdings-note-types',
        label: <FormattedMessage id="ui-inventory.holdingsNoteTypes" />,
        component: HoldingsNoteTypes,
        perm: 'ui-inventory.settings.holdings-note-types',
      },
      {
        route: 'holdings-sources',
        label: <FormattedMessage id="ui-inventory.holdingsSources" />,
        component: HoldingsSources,
        perm: 'ui-inventory.settings.holdings-sources',
      },
      {
        route: 'holdings-types',
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
        route: 'item-note-types',
        label: <FormattedMessage id="ui-inventory.itemNoteTypes" />,
        component: ItemNoteTypes,
        perm: 'ui-inventory.settings.item-note-types',
      },
      {
        route: 'loan-types',
        label: <FormattedMessage id="ui-inventory.loanTypes" />,
        component: LoanTypes,
        perm: 'ui-inventory.settings.loan-types',
      },
      {
        route: 'material-types',
        label: <FormattedMessage id="ui-inventory.materialTypes" />,
        component: MaterialTypes,
        perm: 'ui-inventory.settings.material-types',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-inventory.instanceHoldingsItem" />,
    pages: [
      {
        route: 'statistical-code-types',
        label: <FormattedMessage id="ui-inventory.statisticalCodeTypes" />,
        component: StatisticalCodeTypes,
        perm: 'ui-inventory.settings.statistical-code-types',
      },
      {
        route: 'statistical-code-settings',
        label: <FormattedMessage id="ui-inventory.statisticalCodes" />,
        component: StatisticalCodes,
        perm: 'ui-inventory.settings.statistical-codes',
      },
      {
        route: 'url-relationships',
        label: <FormattedMessage id="ui-inventory.URLrelationship" />,
        component: URLRelationships,
        perm: 'ui-inventory.settings.electronic-access-relationships',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-inventory.holdingsItems" />,
    pages: [
      {
        route: 'call-number-types',
        label: <FormattedMessage id="ui-inventory.callNumberTypes" />,
        component: CallNumberTypes,
        perm: 'ui-inventory.settings.call-number-types',
      },
    ],
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
