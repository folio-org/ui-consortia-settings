import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  CONTRIBUTOR_TYPES_API,
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
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-consortia-settings.code" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const UNIQUE_FIELDS = [FIELDS_MAP.name, FIELDS_MAP.code];
const READONLY_FIELDS = [FIELDS_MAP.source];
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.contributorTypes');
const PERMISSIONS = {
  create: 'inventory-storage.contributor-types.item.post',
  delete: 'inventory-storage.contributor-types.item.delete',
  update: 'inventory-storage.contributor-types.item.put',
};

export const ContributorTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="contributor-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.contributorTypes' })}
      path={CONTRIBUTOR_TYPES_API}
      permissions={PERMISSIONS}
      records="contributorTypes"
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
