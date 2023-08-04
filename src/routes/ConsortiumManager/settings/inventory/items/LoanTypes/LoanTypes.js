import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { LOAN_TYPES_API } from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

const FIELDS_MAP = {
  name: 'name',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.loanType" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.loanTypes');
const PERMISSIONS = {
  create: 'inventory-storage.loan-types.item.post',
  delete: 'inventory-storage.loan-types.item.delete',
  update: 'inventory-storage.loan-types.item.put',
};

export const LoanTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="loan-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.loanTypes' })}
      path={LOAN_TYPES_API}
      permissions={PERMISSIONS}
      records="loantypes"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
