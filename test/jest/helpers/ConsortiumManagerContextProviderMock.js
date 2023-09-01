import { ConsortiumManagerContext } from '../../../src/contexts';
import { affiliations, tenants } from '../fixtures';

const defaultContext = {
  affiliations,
  hasPerm: jest.fn(() => true),
  permissionNamesMap: tenants.reduce((acc, { id }) => ({
    ...acc,
    [id]: {
      post: true,
      delete: true,
      put: true,
    },
  }), {}),
  selectedMembers: tenants.slice(3),
  selectMembers: jest.fn(),
};

export const ConsortiumManagerContextProviderMock = ({ children, context = defaultContext }) => (
  <ConsortiumManagerContext.Provider value={context}>
    {children}
  </ConsortiumManagerContext.Provider>
);
