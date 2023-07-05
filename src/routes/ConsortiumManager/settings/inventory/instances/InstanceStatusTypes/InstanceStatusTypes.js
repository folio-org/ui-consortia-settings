import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  INSTANCE_STATUSES_API,
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
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.instanceStatusType');

const suppress = getSourceSuppressor(RECORD_SOURCE.MARC_RELATOR);
const actionSuppression = { edit: suppress, delete: suppress };

export const InstanceStatusTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="instance-status-types"
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.instanceStatusType' })}
      path={INSTANCE_STATUSES_API}
      records="instanceStatuses"
      translations={TRANSLATIONS}
      actionSuppression={actionSuppression}
      itemTemplate={ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      visibleFields={VISIBLE_FIELDS}
      validate={validateNameAndCodeRequired}
    />
  );
};
