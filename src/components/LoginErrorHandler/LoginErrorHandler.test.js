import {
  render,
  screen,
} from '@testing-library/react';

import {
  ERROR_CODE_DUPLICATES,
  LoginErrorHandler,
} from './LoginErrorHandler';

jest.mock('../FieldTenantSelection', () => ({
  ...jest.requireActual('../FieldTenantSelection'),
  FieldTenantSelectionContainer: jest.fn(() => 'FieldTenantSelectionContainer'),
}));

const defaultProps = {
  data: [{ code: ERROR_CODE_DUPLICATES }],
};

const renderLoginErrorHandler = (props = {}) => render(
  <LoginErrorHandler
    {...defaultProps}
    {...props}
  />,
);

describe('LoginErrorHandler', () => {
  it('should not render handler component if there are no errors to handle', () => {
    renderLoginErrorHandler({ data: [{ code: 'password.incorrect' }] });

    expect(screen.queryByText('FieldTenantSelectionContainer')).not.toBeInTheDocument();
  });

  it('should render component to handle login error (duplicate usernames error)', () => {
    renderLoginErrorHandler();

    expect(screen.getByText('FieldTenantSelectionContainer')).toBeInTheDocument();
  });
});
