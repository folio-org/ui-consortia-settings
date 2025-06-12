import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import {
  BE_INTERFACE,
  MODULE_ROOT_ROUTE,
} from '../../../../constants';
import { filterSectionsByInterfaces } from '../../utils';
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

const {
  ALTERNATIVE_TITLE_TYPES,
  CALL_NUMBER_TYPES,
  CLASSIFICATION_TYPES,
  CONTRIBUTOR_TYPES,
  ELECTRONIC_ACCESS_RELATIONSHIPS,
  HOLDINGS_NOTE_TYPES,
  HOLDINGS_SOURCES,
  HOLDINGS_TYPES,
  IDENTIFIERS_TYPES,
  INSTANCE_FORMATS,
  INSTANCE_NOTE_TYPES,
  INSTANCE_STATUSES,
  INSTANCE_TYPES,
  ITEM_NOTE_TYPES,
  LOAN_TYPES,
  MATERIAL_TYPES,
  MODES_OF_ISSUANCE,
  NATURE_OF_CONTENT_TERMS,
  STATISTICAL_CODES,
  STATISTICAL_CODE_TYPES,
  SUBJECT_SOURCES,
  SUBJECT_TYPES,
} = BE_INTERFACE;

const sections = [
  {
    label: <FormattedMessage id="ui-inventory.instances" />,
    pages: [
      {
        route: 'alternative-title-types',
        label: <FormattedMessage id="ui-inventory.alternativeTitleTypes" />,
        component: AlternativeTitleTypes,
        perm: 'ui-inventory.settings.alternative-title-types',
        _interfaces: [ALTERNATIVE_TITLE_TYPES],
      },
      {
        route: 'classification-types',
        label: <FormattedMessage id="ui-inventory.classificationIdentifierTypes" />,
        component: ClassificationTypes,
        perm: 'ui-inventory.settings.classification-types',
        _interfaces: [CLASSIFICATION_TYPES],
      },
      {
        route: 'contributor-types',
        label: <FormattedMessage id="ui-inventory.contributorTypes" />,
        component: ContributorTypes,
        perm: 'ui-inventory.settings.contributor-types',
        _interfaces: [CONTRIBUTOR_TYPES],
      },
      {
        route: 'formats',
        label: <FormattedMessage id="ui-inventory.formats" />,
        component: Formats,
        perm: 'ui-inventory.settings.instance-formats',
        _interfaces: [INSTANCE_FORMATS],
      },
      {
        route: 'instance-note-types',
        label: <FormattedMessage id="ui-inventory.instanceNoteTypes" />,
        component: InstanceNoteTypes,
        perm: 'ui-inventory.settings.instance-note-types',
        _interfaces: [INSTANCE_NOTE_TYPES],
      },
      {
        route: 'instance-status-types',
        label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
        component: InstanceStatusTypes,
        perm: 'ui-inventory.settings.instance-statuses',
        _interfaces: [INSTANCE_STATUSES],
      },
      {
        route: 'modes-of-issuance',
        label: <FormattedMessage id="ui-inventory.modesOfIssuance" />,
        component: ModesOfIssuance,
        perm: 'ui-inventory.settings.modes-of-issuance',
        _interfaces: [MODES_OF_ISSUANCE],
      },
      {
        route: 'nature-of-content-terms',
        label: <FormattedMessage id="ui-inventory.natureOfContentTerms" />,
        component: NatureOfContentTerms,
        perm: 'ui-inventory.settings.nature-of-content-terms',
        _interfaces: [NATURE_OF_CONTENT_TERMS],
      },
      {
        route: 'identifier-types',
        label: <FormattedMessage id="ui-inventory.resourceIdentifierTypes" />,
        component: ResourceIdentifierTypes,
        perm: 'ui-inventory.settings.identifier-types',
        _interfaces: [IDENTIFIERS_TYPES],
      },
      {
        route: 'resource-types',
        label: <FormattedMessage id="ui-inventory.resourceTypes" />,
        component: ResourceTypes,
        perm: 'ui-inventory.settings.instance-types',
        _interfaces: [INSTANCE_TYPES],
      },
      {
        route: 'subject-sources',
        label: <FormattedMessage id="ui-inventory.subjectSources" />,
        component: SubjectSources,
        perm: 'ui-inventory.settings.subject-sources',
        _interfaces: [SUBJECT_SOURCES],
      },
      {
        route: 'subject-types',
        label: <FormattedMessage id="ui-inventory.subjectTypes" />,
        component: SubjectTypes,
        perm: 'ui-inventory.settings.subject-types',
        _interfaces: [SUBJECT_TYPES],
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
        _interfaces: [HOLDINGS_NOTE_TYPES],
      },
      {
        route: 'holdings-sources',
        label: <FormattedMessage id="ui-inventory.holdingsSources" />,
        component: HoldingsSources,
        perm: 'ui-inventory.settings.holdings-sources',
        _interfaces: [HOLDINGS_SOURCES],
      },
      {
        route: 'holdings-types',
        label: <FormattedMessage id="ui-inventory.holdingsTypes" />,
        component: HoldingsTypes,
        perm: 'ui-inventory.settings.holdings-types',
        _interfaces: [HOLDINGS_TYPES],
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
        _interfaces: [ITEM_NOTE_TYPES],
      },
      {
        route: 'loan-types',
        label: <FormattedMessage id="ui-inventory.loanTypes" />,
        component: LoanTypes,
        perm: 'ui-inventory.settings.loan-types',
        _interfaces: [LOAN_TYPES],
      },
      {
        route: 'material-types',
        label: <FormattedMessage id="ui-inventory.materialTypes" />,
        component: MaterialTypes,
        perm: 'ui-inventory.settings.material-types',
        _interfaces: [MATERIAL_TYPES],
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
        _interfaces: [STATISTICAL_CODE_TYPES],
      },
      {
        route: 'statistical-code-settings',
        label: <FormattedMessage id="ui-inventory.statisticalCodes" />,
        component: StatisticalCodes,
        perm: 'ui-inventory.settings.statistical-codes',
        _interfaces: [STATISTICAL_CODES],
      },
      {
        route: 'url-relationships',
        label: <FormattedMessage id="ui-inventory.URLrelationship" />,
        component: URLRelationships,
        perm: 'ui-inventory.settings.electronic-access-relationships',
        _interfaces: [ELECTRONIC_ACCESS_RELATIONSHIPS],
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
        _interfaces: [CALL_NUMBER_TYPES],
      },
    ],
  },
];

const InventorySettings = ({ stripes, ...props }) => {
  const filteredSections = useMemo(() => filterSectionsByInterfaces(stripes, sections), [stripes]);

  return (
    <Settings
      {...props}
      sections={filteredSections}
      stripes={stripes}
      paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
      paneBackLink={MODULE_ROOT_ROUTE}
    />
  );
};

InventorySettings.propTypes = {
  stripes: stripesShape.isRequired,
};

export default InventorySettings;
