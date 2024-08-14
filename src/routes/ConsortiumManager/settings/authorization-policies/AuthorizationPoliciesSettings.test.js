import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { renderWithRouter } from 'helpers';
import { useMemberSelection } from '../../hooks';
import AuthorizationPoliciesSettings from './AuthorizationPoliciesSettings';

jest.mock('../../hooks');

describe('AuthorizationPoliciesSettings', () => {
  const props = {
    someProp: 'someValue',
  };

  const membersOptions = [
    { value: 'member1', label: 'Member 1' },
    { value: 'member2', label: 'Member 2' },
  ];

  const setActiveMember = jest.fn();

  beforeEach(() => {
    useMemberSelection.mockReturnValue({
      activeMember: 'member1',
      membersOptions,
      setActiveMember,
    });
  });

  it('should render the component', () => {
    renderWithRouter(<AuthorizationPoliciesSettings {...props} />);

    expect(screen.getByLabelText('Member 1')).toBeInTheDocument();
    expect(screen.getByText('Member 2')).toBeInTheDocument();
  });

  it('should call `handleSearchSubmit` on click search button', async () => {
    const searchQuery = 'test';
    renderWithRouter(<AuthorizationPoliciesSettings {...props} />);

    const searchInput = screen.getByLabelText('stripes-authorization-components.search');

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, searchQuery);
    await userEvent.click(screen.getByRole('button', { name: 'stripes-authorization-components.search' }));

    expect(screen.getByLabelText('stripes-authorization-components.search')).toHaveDisplayValue(searchQuery);
  });
});
