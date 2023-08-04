import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  INSTANCE_TYPES_API,
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
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-consortia-settings.code" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.resourceTypes');
const PERMISSIONS = {
  create: 'inventory-storage.instance-types.item.post',
  delete: 'inventory-storage.instance-types.item.delete',
  update: 'inventory-storage.instance-types.item.put',
};

const suppress = getSourceSuppressor(RECORD_SOURCE.RDA_CONTENT);
const actionSuppression = { edit: suppress, delete: suppress };

export const ResourceTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="instance-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.resourceTypes' })}
      path={INSTANCE_TYPES_API}
      permissions={PERMISSIONS}
      records="instanceTypes"
      translations={TRANSLATIONS}
      actionSuppression={actionSuppression}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      visibleFields={VISIBLE_FIELDS}
      validate={validateNameAndCodeRequired}
    />
  );
};
