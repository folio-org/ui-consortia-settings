import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';

import { useConsortiumMembers } from '../../hooks';
import { FieldTenantSelection } from './FieldTenantSelection';

export const FieldTenantSelectionContainer = ({
  disabled,
  stripes,
  ...rest
}) => {
  const {
    tenants,
    isFetching,
  } = useConsortiumMembers({ stripes });

  return (
    <FieldTenantSelection
      tenants={tenants}
      disabled={disabled || isFetching}
      {...rest}
    />
  );
};

FieldTenantSelectionContainer.propTypes = {
  disabled: PropTypes.bool,
  stripes: stripesShape,
};
