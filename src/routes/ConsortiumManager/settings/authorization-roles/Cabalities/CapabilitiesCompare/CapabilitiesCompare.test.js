import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';

import { ConsortiumManagerContextProviderMock } from 'helpers';
import {CapabilitiesCompare} from './CapablitiesCompare';

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
  <CapabilitiesCompare
    {...props}
  />,
  { wrapper },
);

jest.mock('./CapabilitiesCompareItem', () => ({
  CapabilitiesCompareItem: () => <span>CapabilitiesCompareItem</span>,
}));

describe('PermissionSetsCompare', () => {
  it('should render component', () => {
    renderComponent();
    expect(screen.getAllByText('CapabilitiesCompareItem').length).toBe(2);
  });
});
