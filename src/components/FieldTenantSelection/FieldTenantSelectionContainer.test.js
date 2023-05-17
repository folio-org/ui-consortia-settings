import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import { tenants } from '../../../test/jest/fixtures';
import { useConsortiumMembers } from '../../hooks';
import { FieldTenantSelectionContainer } from './FieldTenantSelectionContainer';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useConsortiumMembers: jest.fn(),
}));

const defaultProps = {
  id: 'tenant',
  labelId: 'tenant.field',
  name: 'tenant',
  required: true,
};

const renderFieldTenantSelectionContainer = (props = {}) => render(
  <Form
    onSubmit={noop}
    render={() => (
      <FieldTenantSelectionContainer
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldTenantSelectionContainer', () => {
  beforeEach(() => {
    useConsortiumMembers.mockReturnValue({ tenants });
  });
  afterEach(cleanup);

  it('should render selection options', () => {
    renderFieldTenantSelectionContainer();

    tenants.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
