import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

export const FieldStatisticalCodeType = ({
  field,
  groupedStatisticalCodeTypes,
  rowIndex,
  ...props
}) => {
  const intl = useIntl();
  const { values } = useFormState();
  const { id, tenantId, shared } = get(values, `${field}[${rowIndex}]`, {});

  const dataOptions = useMemo(() => {
    const mapKey = shared || !id ? 'shared' : `local[${tenantId}]`;

    return (
      get(groupedStatisticalCodeTypes, mapKey, [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id: _id, name }) => ({ label: name, value: _id }))
    );
  }, [groupedStatisticalCodeTypes, id, shared, tenantId]);

  return (
    <Field
      component={Select}
      marginBottom0
      fullWidth
      dataOptions={dataOptions}
      placeholder={intl.formatMessage({ id: 'ui-inventory.selectStatisticalCode' })}
      {...props}
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
  groupedStatisticalCodeTypes: PropTypes.shape({
    local: PropTypes.object,
    shared: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  }),
  rowIndex: PropTypes.number.isRequired,
};
