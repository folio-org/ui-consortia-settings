import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';

import { ConsortiumManagerContextProviderMock } from 'helpers';
import { UsersCapabilitiesCompare } from './UsersCapabilitiesCompare';

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
  <UsersCapabilitiesCompare {...props} />,
  { wrapper },
);

jest.mock('../UsersCapabilitiesCompareItems', () => ({
  UsersCapabilitiesCompareItems: () => <span>UsersCapabilitiesCompareItems</span>,
}));

describe('PermissionSetsCompare', () => {
  it('should render component', () => {
    renderComponent();
    expect(screen.getAllByText('UsersCapabilitiesCompareItems').length).toBe(2);
  });
});
