import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  NATURE_OF_CONTENT_TERMS_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const FIELDS_MAP = {
  name: 'name',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const READONLY_FIELDS = [FIELDS_MAP.source];
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.natureOfContentTerms');
const PERMISSIONS = {
  create: 'inventory-storage.nature-of-content-terms.item.post',
  delete: 'inventory-storage.nature-of-content-terms.item.delete',
  update: 'inventory-storage.nature-of-content-terms.item.put',
};

const suppress = getSourceSuppressor(RECORD_SOURCE.FOLIO);
const actionSuppression = { edit: suppress, delete: suppress };

export const NatureOfContentTerms = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="nature-of-content-terms"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.natureOfContentTerms' })}
      path={NATURE_OF_CONTENT_TERMS_API}
      permissions={PERMISSIONS}
      records="natureOfContentTerms"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
