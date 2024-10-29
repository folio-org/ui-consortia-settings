import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { getStatisticalCodeTypeOptions } from './utils';

export const FieldStatisticalCodeType = ({
  field,
  fieldProps,
  groupedStatisticalCodeTypes,
  rowIndex,
}) => {
  const intl = useIntl();
  const { values } = useFormState();
  const { id, tenantId, shared, statisticalCodeTypeId } = get(values, `${field}[${rowIndex}]`, {});

  const dataOptions = useMemo(() => getStatisticalCodeTypeOptions({
    id,
    shared,
    tenantId,
    statisticalCodeTypeId,
    groupedStatisticalCodeTypes,
  }), [groupedStatisticalCodeTypes, id, shared, statisticalCodeTypeId, tenantId]);

  return (
    <Field
      component={Select}
      marginBottom0
      fullWidth
      dataOptions={dataOptions}
      placeholder={intl.formatMessage({ id: 'ui-inventory.selectStatisticalCode' })}
      {...fieldProps}
    />
  );
};

FieldStatisticalCodeType.defaultProps = {
  groupedStatisticalCodeTypes: {
    local: {},
    shared: [],
  },
};

FieldStatisticalCodeType.propTypes = {
  field: PropTypes.string.isRequired,
  fieldProps: PropTypes.shape({
    name: PropTypes.string,
    'aria-label': PropTypes.string,
  }).isRequired,
  groupedStatisticalCodeTypes: PropTypes.shape({
    local: PropTypes.object,
    shared: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  }),
  rowIndex: PropTypes.number.isRequired,
};
