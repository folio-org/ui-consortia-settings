import PropTypes from 'prop-types';

export const affiliationsShape = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string,
  isPrimary: PropTypes.bool,
  tenantId: PropTypes.string,
  tenantName: PropTypes.string,
  userId: PropTypes.string,
  username: PropTypes.string,
}));

export const publicationType = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.string).isRequired,
  payload: PropTypes.any,
};
export const publicationShape = PropTypes.shape(publicationType);

export const translationsShape = PropTypes.shape({
  cannotDeleteTermHeader: PropTypes.string,
  cannotDeleteTermMessage: PropTypes.string,
  deleteEntry: PropTypes.string,
  termCreated: PropTypes.string,
  termDeleted: PropTypes.string,
  termUpdated: PropTypes.string,
  termWillBeDeleted: PropTypes.string,
});
