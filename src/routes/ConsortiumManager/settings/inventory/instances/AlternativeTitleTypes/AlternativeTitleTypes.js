import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { ALTERNATIVE_TITLE_TYPES_API } from '../../../../../../constants';
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
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.alternativeTitleTypes');
const PERMISSIONS = {
  create: 'inventory-storage.alternative-title-types.item.post',
  delete: 'inventory-storage.alternative-title-types.item.delete',
  update: 'inventory-storage.alternative-title-types.item.put',
};

export const AlternativeTitleTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="alternative-title-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.alternativeTitleTypes' })}
      path={ALTERNATIVE_TITLE_TYPES_API}
      permissions={PERMISSIONS}
      records="alternativeTitleTypes"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
