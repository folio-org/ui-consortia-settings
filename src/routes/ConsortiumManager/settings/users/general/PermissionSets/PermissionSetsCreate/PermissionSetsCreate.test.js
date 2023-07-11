import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { Paneset } from '@folio/stripes/components';

import {
  ConsortiumManagerContextProviderMock,
  buildStripesObject,
} from '../../../../../../../../test/jest/helpers';
import { PermissionSetsCreate } from './PermissionSetsCreate';

const STRIPES = buildStripesObject();

const defaultProps = {
  onCancel: jest.fn(),
  onSave: jest.fn(),
  intl: {},
  stripes: STRIPES,
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      <Paneset>
        {children}
      </Paneset>
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <PermissionSetsCreate
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

jest.mock('../../../../../../../temp/PermissionsAccordion', () => (jest.fn(() => <div>PermissionsAccordion</div>)));

describe('PermissionSetsCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-users.permissions.newPermissionSet')).toBeInTheDocument();
    expect(screen.getByText('PermissionsAccordion')).toBeInTheDocument();
  });

  it('should call onSave function', async () => {
    const onSave = jest.fn();

    renderComponent({ onSave });

    const displayNameInput = screen.getByRole('textbox', { name: 'ui-users.permissions.permissionSetName' });
    const saveButton = screen.getByText('ui-users.saveAndClose');

    userEvent.type(displayNameInput, 'test');
    await waitFor(() => expect(displayNameInput.value).toBe('test'));

    userEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });

  it('should call onCancel function', () => {
    const onCancel = jest.fn();

    renderComponent({ onCancel });

    const cancelButton = screen.getByText('ui-users.cancel');

    userEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});
