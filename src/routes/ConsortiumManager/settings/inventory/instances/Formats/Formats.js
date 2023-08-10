import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  INSTANCE_FORMATS_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { validateNameAndCodeRequired } from '../../../../utils';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const FIELDS_MAP = {
  name: 'name',
  code: 'code',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const PERMISSIONS = {
  create: 'inventory-storage.instance-formats.item.post',
  delete: 'inventory-storage.instance-formats.item.delete',
  update: 'inventory-storage.instance-formats.item.put',
};
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-consortia-settings.code" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const UNIQUE_FIELDS = [FIELDS_MAP.name, FIELDS_MAP.code];
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.formats');

const suppress = getSourceSuppressor(RECORD_SOURCE.RDA_CARRIER);
const actionSuppression = { edit: suppress, delete: suppress };

export const Formats = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="formats"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.formats' })}
      path={INSTANCE_FORMATS_API}
      permissions={PERMISSIONS}
      records="instanceFormats"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      actionSuppression={actionSuppression}
      readOnlyFields={READONLY_FIELDS}
      uniqueFields={UNIQUE_FIELDS}
      validate={validateNameAndCodeRequired}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
