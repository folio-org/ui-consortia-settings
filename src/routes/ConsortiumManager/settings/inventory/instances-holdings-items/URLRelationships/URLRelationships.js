import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { ELECTRONIC_ACCESS_RELATIONSHIPS_API } from '../../../../../../constants';
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
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.URLrelationship');
const PERMISSIONS = {
  create: 'inventory-storage.electronic-access-relationships.item.post',
  delete: 'inventory-storage.electronic-access-relationships.item.delete',
  update: 'inventory-storage.electronic-access-relationships.item.put',
};

export const URLRelationships = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="electronic-access-relationships"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.URLrelationship' })}
      path={ELECTRONIC_ACCESS_RELATIONSHIPS_API}
      permissions={PERMISSIONS}
      records="electronicAccessRelationships"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
