import { render, screen } from '@testing-library/react';

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
    render(<AuthorizationPoliciesSettings {...props} />);

    expect(screen.getByLabelText('Member 1')).toBeInTheDocument();
    expect(screen.getByText('Member 2')).toBeInTheDocument();
  });
});
