import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { CALL_NUMBER_TYPES_API } from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.callNumberTypes');
const FIELDS_MAP = {
  name: 'name',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const PERMISSIONS = {
  create: 'inventory-storage.call-number-types.item.post',
  delete: 'inventory-storage.call-number-types.item.delete',
  update: 'inventory-storage.call-number-types.item.put',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};

export const CallNumberTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="call-number-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.callNumberTypes' })}
      path={CALL_NUMBER_TYPES_API}
      permissions={PERMISSIONS}
      records="callNumberTypes"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
