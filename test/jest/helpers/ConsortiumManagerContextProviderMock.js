import { ConsortiumManagerContext } from '../../../src/contexts';
import { affiliations, tenants } from '../fixtures';

const context = {
  affiliations,
  selectedMembers: tenants.slice(3),
  selectMembers: jest.fn(),
  selectMembersDisabled: false,
};

export const ConsortiumManagerContextProviderMock = ({ children }) => (
  <ConsortiumManagerContext.Provider value={context}>
    {children}
  </ConsortiumManagerContext.Provider>
);
