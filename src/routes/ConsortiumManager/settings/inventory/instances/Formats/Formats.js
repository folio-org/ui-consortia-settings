import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  INSTANCE_FORMATS_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import { validateNameAndCodeRequired } from '../../../../utils';

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

const suppress = getSourceSuppressor(RECORD_SOURCE.RDA_CARRIER);
const actionSuppression = { edit: suppress, delete: suppress };

export const Formats = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="formats"
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.formats' })}
      path={INSTANCE_FORMATS_API}
      records="instanceFormats"
      translations={getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.formats')}
      itemTemplate={{ source: RECORD_SOURCE.LOCAL }}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      validate={validateNameAndCodeRequired}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
