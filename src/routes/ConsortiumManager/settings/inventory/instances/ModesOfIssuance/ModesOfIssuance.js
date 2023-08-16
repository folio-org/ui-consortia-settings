import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  MODES_OF_ISSUANCE_API,
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
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.modesOfIssuance');
const UNIQUE_FIELDS = [FIELDS_MAP.name];
const PERMISSIONS = {
  create: 'inventory-storage.modes-of-issuance.item.post',
  delete: 'inventory-storage.modes-of-issuance.item.delete',
  update: 'inventory-storage.modes-of-issuance.item.put',
};

const suppress = getSourceSuppressor(RECORD_SOURCE.RDA_MODE_ISSUE);
const actionSuppression = { edit: suppress, delete: suppress };

export const ModesOfIssuance = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="modes-of-issuance"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.modesOfIssuance' })}
      path={MODES_OF_ISSUANCE_API}
      permissions={PERMISSIONS}
      records="issuanceModes"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
