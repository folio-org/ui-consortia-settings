import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  CLASSIFICATION_TYPES_API,
  RECORD_SOURCE,
} from '../../../../../../constants';

const FIELDS_MAP = {
  name: 'name',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};

const suppress = getSourceSuppressor(RECORD_SOURCE.FOLIO);
const actionSuppression = { edit: suppress, delete: suppress };

export const ClassificationTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="classification-types"
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.classificationIdentifierTypes' })}
      path={CLASSIFICATION_TYPES_API}
      records="classificationTypes"
      translations={getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.classificationTypes')}
      itemTemplate={{ source: RECORD_SOURCE.LOCAL }}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
