import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  STATISTICAL_CODES_API,
  STATISTICAL_CODE_TYPES_API,
} from '../../../../../../constants';
import { useSettings } from '../../../../../../hooks/consortiumManager';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { groupMembersSettings } from '../../../../utils';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';
import { FieldStatisticalCodeType } from './FieldStatisticalCodeType';
import { validate } from './validate';

const FIELDS_MAP = {
  code: 'code',
  name: 'name',
  statisticalCodeTypeId: 'statisticalCodeTypeId',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.statisticalCodeNames" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-inventory.statisticalCodes" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
  [FIELDS_MAP.statisticalCodeTypeId]: <FormattedMessage id="ui-inventory.statisticalCodeTypes" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.statisticalCodes');
const PERMISSIONS = {
  create: 'inventory-storage.statistical-codes.item.post',
  delete: 'inventory-storage.statistical-codes.item.delete',
  update: 'inventory-storage.statistical-codes.item.put',
};

const formatStatisticalCodeTypeId = (statisticalCodeTypes) => (item) => {
  const record = Array.isArray(statisticalCodeTypes)
    ? statisticalCodeTypes.find(element => element.id === item.statisticalCodeTypeId)
    : null;

  return record ? <p>{record.name}</p> : null;
};

const renderStatisticalCodeTypeField = (groupedStatisticalCodeTypes) => (props) => (
  <FieldStatisticalCodeType
    groupedStatisticalCodeTypes={groupedStatisticalCodeTypes}
    {...props}
  />
);

export const StatisticalCodes = () => {
  const intl = useIntl();

  const {
    entries: statisticalCodeTypes,
    isFetching,
  } = useSettings({
    path: STATISTICAL_CODE_TYPES_API,
    records: 'statisticalCodeTypes',
  });

  const fieldComponents = useMemo(() => ({
    [FIELDS_MAP.statisticalCodeTypeId]: renderStatisticalCodeTypeField(groupMembersSettings(statisticalCodeTypes)),
  }), [statisticalCodeTypes]);

  const formatter = useMemo(() => ({
    [FIELDS_MAP.statisticalCodeTypeId]: formatStatisticalCodeTypeId(statisticalCodeTypes),
  }), [statisticalCodeTypes]);

  return (
    <ConsortiaControlledVocabulary
      id="statistical-codes"
      isLoading={isFetching}
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      fieldComponents={fieldComponents}
      formatter={formatter}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
      path={STATISTICAL_CODES_API}
      permissions={PERMISSIONS}
      records="statisticalCodes"
      translations={TRANSLATIONS}
      itemTemplate={DEFAULT_ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      sortby={FIELDS_MAP.code}
      validate={validate}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
