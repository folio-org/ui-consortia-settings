import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { FieldSelectionFinal } from '@folio/stripes-acq-components';

export const FieldTenantSelection = ({
  tenants,
  ...props
}) => {
  const dataOptions = useMemo(() => (
    tenants.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
  ), [tenants]);

  return (
    <FieldSelectionFinal
      dataOptions={dataOptions}
      {...props}
    />
  );
};

FieldTenantSelection.defaultProps = {
  tenants: [],
};

FieldTenantSelection.propTypes = {
  tenants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
    isCentral: PropTypes.bool,
  })),
};
