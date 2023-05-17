import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { FieldTenantSelectionContainer as FieldTenantSelection } from '../FieldTenantSelection';

export const ERROR_CODE_DUPLICATES = 'multiple.matching.users';

export const LoginErrorHandler = ({ data: authErrors }) => {
  const error = authErrors.find(({ code }) => code === ERROR_CODE_DUPLICATES);

  if (!error) return null;

  return (
    <Row center="xs">
      <Col xs={6}>
        <FieldTenantSelection
          id="primary-affiliation-select"
          labelId="ui-consortia-settings.affiliation.primary.field.label"
          name="tenant"
          autoFocus
          required
        />
      </Col>
    </Row>
  );
};

LoginErrorHandler.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
    parameters: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
  })).isRequired,
};
