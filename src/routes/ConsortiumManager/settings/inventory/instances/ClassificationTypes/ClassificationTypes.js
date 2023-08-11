import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  CLASSIFICATION_TYPES_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const suppress = getSourceSuppressor(RECORD_SOURCE.FOLIO);
const actionSuppression = { edit: suppress, delete: suppress };

const FIELDS_MAP = {
  name: 'name',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.classificationTypes');
const PERMISSIONS = {
  create: 'inventory-storage.classification-types.item.post',
  delete: 'inventory-storage.classification-types.item.delete',
  update: 'inventory-storage.classification-types.item.put',
};
const UNIQUE_FIELDS = [FIELDS_MAP.name];

export const ClassificationTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="classification-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.classificationIdentifierTypes' })}
      path={CLASSIFICATION_TYPES_API}
      permissions={PERMISSIONS}
      records="classificationTypes"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
