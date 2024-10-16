import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  RECORD_SOURCE,
  SUBJECT_SOURCES_API,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { validateNameRequired } from '../../../../utils';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const FIELDS_MAP = {
  name: 'name',
  code: 'code',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const READONLY_FIELDS = [FIELDS_MAP.source];
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-inventory.code" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.subjectSources');
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const PERMISSIONS = {
  create: 'inventory-storage.subject-sources.item.post',
  delete: 'inventory-storage.subject-sources.item.delete',
  update: 'inventory-storage.subject-sources.item.put',
};

const suppress = getSourceSuppressor(RECORD_SOURCE.FOLIO);
const actionSuppression = { edit: suppress, delete: suppress };

export const SubjectSources = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="subject-sources"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.subjectSources' })}
      path={SUBJECT_SOURCES_API}
      permissions={PERMISSIONS}
      records="subjectSources"
      translations={TRANSLATIONS}
      actionSuppression={actionSuppression}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
      validate={validateNameRequired}
    />
  );
};
