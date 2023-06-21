import { act, renderHook } from '@testing-library/react-hooks';

import { tenants } from '../../../../../test/jest/fixtures';
import { ConsortiumManagerContextProviderMock } from '../../../../../test/jest/helpers';
import { useMemberSelection } from './useMemberSelection';

const wrapper = ({ children }) => (
  <ConsortiumManagerContextProviderMock>
    {children}
  </ConsortiumManagerContextProviderMock>
);

const membersToSelect = tenants.slice(3);

describe('useTenantPermissions', () => {
  it('should return the options list of members', async () => {
    const { result } = renderHook(() => useMemberSelection({ tenantId: 'test' }), { wrapper });

    expect(result.current.membersOptions).toEqual(membersToSelect.map(({ id, name }) => ({ label: name, value: id })));
  });

  it('should switch the active member to the first in the list if the selected member refers to a non-existing one', async () => {
    const { result } = renderHook(() => useMemberSelection({ tenantId: 'diku' }), { wrapper });

    await act(async () => { result.current.setActiveMember(membersToSelect[2].id); });

    expect(result.current.activeMember).toEqual(membersToSelect[2].id);

    await act(async () => { result.current.setActiveMember('nonExistingMemberId'); });

    expect(result.current.activeMember).toEqual(membersToSelect[0].id);
  });
});
