import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

export const FieldStatisticalCodeType = ({
  statisticalCodeTypes,
  ...props
}) => {
  const intl = useIntl();

  const dataOptions = useMemo(() => (
    statisticalCodeTypes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ id, name }) => ({ label: name, value: id }))
  ), [statisticalCodeTypes]);

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
  statisticalCodeTypes: [],
};

FieldStatisticalCodeType.propTypes = {
  statisticalCodeTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
