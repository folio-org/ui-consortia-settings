import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  RECORD_SOURCE,
  STATISTICAL_CODES_API,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { useStatisticalCodeTypes } from '../hooks';
import { FieldStatisticalCodeType } from './FieldStatisticalCodeType';
import { validate } from './validate';

const ITEM_TEMPLATE = { source: RECORD_SOURCE.LOCAL };
const FIELDS_MAP = {
  name: 'name',
  code: 'code',
  source: 'source',
  statisticalCodeTypeId: 'statisticalCodeTypeId',
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

const formatStatisticalCodeTypeId = (statisticalCodeTypes) => (item) => {
  const record = Array.isArray(statisticalCodeTypes)
    ? statisticalCodeTypes.find(element => element.id === item.statisticalCodeTypeId)
    : null;

  return record ? <p>{record.name}</p> : null;
};

const renderStatisticalCodeTypeField = (statisticalCodeTypes) => ({ fieldProps }) => (
  <FieldStatisticalCodeType
    statisticalCodeTypes={statisticalCodeTypes}
    {...fieldProps}
  />
);

export const StatisticalCodes = () => {
  const intl = useIntl();

  const {
    isFetching,
    statisticalCodeTypes,
  } = useStatisticalCodeTypes();

  const fieldComponents = useMemo(() => ({
    [FIELDS_MAP.statisticalCodeTypeId]: renderStatisticalCodeTypeField(statisticalCodeTypes),
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
      records="statisticalCodes"
      translations={TRANSLATIONS}
      itemTemplate={ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      sortby={FIELDS_MAP.code}
      validate={validate}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
