import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  CONTRIBUTOR_TYPES_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import { validateNameAndCodeRequired } from '../../../../utils';

const ITEM_TEMPLATE = { source: RECORD_SOURCE.LOCAL };
const FIELDS_MAP = {
  name: 'name',
  code: 'code',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-consortia-settings.code" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.contributorTypes');

const suppress = getSourceSuppressor(RECORD_SOURCE.MARC_RELATOR);
const actionSuppression = { edit: suppress, delete: suppress };

export const ContributorTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="contributor-types"
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.contributorTypes' })}
      path={CONTRIBUTOR_TYPES_API}
      records="contributorTypes"
      translations={TRANSLATIONS}
      itemTemplate={ITEM_TEMPLATE}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      validate={validateNameAndCodeRequired}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
