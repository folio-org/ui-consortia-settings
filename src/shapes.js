import PropTypes from 'prop-types';

export const affiliationsShape = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string,
  isPrimary: PropTypes.bool,
  tenantId: PropTypes.string,
  tenantName: PropTypes.string,
  userId: PropTypes.string,
  username: PropTypes.string,
}));
