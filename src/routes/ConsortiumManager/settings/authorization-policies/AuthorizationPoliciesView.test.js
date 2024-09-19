import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { renderWithRouter } from 'helpers';
import { useMemberSelection } from '../../hooks';
import { AuthorizationPoliciesView } from './AuthorizationPoliciesView';

jest.mock('../../hooks');

describe('AuthorizationPoliciesView', () => {
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

  it('should render the component', async () => {
    renderWithRouter(<AuthorizationPoliciesView {...props} />);

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));

    expect(screen.getByLabelText('Member 1')).toBeInTheDocument();
    expect(screen.getByText('Member 2')).toBeInTheDocument();
  });

  it('should call `handleSearchSubmit` on click search button', async () => {
    const searchQuery = 'test';

    renderWithRouter(<AuthorizationPoliciesView {...props} />);

    const searchInput = screen.getByLabelText('ui-consortia-settings.authorizationPolicy.search');

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, searchQuery);
    await userEvent.click(screen.getByRole('button', { name: 'ui-consortia-settings.authorizationPolicy.search' }));

    expect(screen.getByLabelText('ui-consortia-settings.authorizationPolicy.search')).toHaveDisplayValue(searchQuery);
  });
});
