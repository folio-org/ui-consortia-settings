import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { HOLDINGS_SOURCES_API } from '../../../../../../constants';
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

const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const READONLY_FIELDS = [FIELDS_MAP.source];
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.holdingsSources');
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const PERMISSIONS = {
  create: 'inventory-storage.holdings-sources.item.post',
  delete: 'inventory-storage.holdings-sources.item.delete',
  update: 'inventory-storage.holdings-sources.item.put',
};
const UNIQUE_FIELDS = [FIELDS_MAP.name];

export const HoldingsSources = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="holdings-sources"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.holdingsSources' })}
      path={HOLDINGS_SOURCES_API}
      permissions={PERMISSIONS}
      records="holdingsRecordsSources"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
