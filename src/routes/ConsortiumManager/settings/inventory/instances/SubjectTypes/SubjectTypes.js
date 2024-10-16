import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  RECORD_SOURCE,
  SUBJECT_TYPES_API,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { validateNameRequired } from '../../../../utils';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const suppress = getSourceSuppressor(RECORD_SOURCE.FOLIO);

const FIELDS_MAP = {
  name: 'name',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const READONLY_FIELDS = [FIELDS_MAP.source];
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const PERMISSIONS = {
  create: 'inventory-storage.subject-types.item.post',
  update: 'inventory-storage.subject-types.item.put',
  delete: 'inventory-storage.subject-types.item.delete',
};

export const SubjectTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="subject-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.subjectTypes' })}
      path={SUBJECT_TYPES_API}
      permissions={PERMISSIONS}
      records="subjectTypes"
      translations={getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.subjectTypes')}
      actionSuppression={{ edit: suppress, delete: suppress }}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
      validate={validateNameRequired}
    />
  );
};
