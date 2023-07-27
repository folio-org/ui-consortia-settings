import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  INSTANCE_STATUSES_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { validateNameAndCodeRequired } from '../../../../utils';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const suppress = getSourceSuppressor(RECORD_SOURCE.MARC_RELATOR);
const actionSuppression = { edit: suppress, delete: suppress };

const FIELDS_MAP = {
  name: 'name',
  code: 'code',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.code]: <FormattedMessage id="ui-consortia-settings.code" />,
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.instanceStatusType');
const PERMISSIONS = {
  create: 'inventory-storage.instance-statuses.item.post',
  delete: 'inventory-storage.instance-statuses.item.delete',
  update: 'inventory-storage.instance-statuses.item.put',
};

export const InstanceStatusTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="instance-status-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.instanceStatusType' })}
      path={INSTANCE_STATUSES_API}
      permissions={PERMISSIONS}
      records="instanceStatuses"
      translations={TRANSLATIONS}
      actionSuppression={actionSuppression}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      visibleFields={VISIBLE_FIELDS}
      validate={validateNameAndCodeRequired}
    />
  );
};
