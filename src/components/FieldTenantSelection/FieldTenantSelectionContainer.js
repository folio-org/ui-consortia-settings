import PropTypes from 'prop-types';

import { useConsortiumMembers } from '../../hooks';
import { FieldTenantSelection } from './FieldTenantSelection';

export const FieldTenantSelectionContainer = ({
  disabled,
  ...rest
}) => {
  const {
    tenants,
    isFetching,
  } = useConsortiumMembers();

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
};
