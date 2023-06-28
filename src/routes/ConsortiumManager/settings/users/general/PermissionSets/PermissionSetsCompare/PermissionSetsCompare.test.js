import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Paneset } from '@folio/stripes/components';
import { ConsortiumManagerContextProviderMock } from 'helpers';
import { PermissionSetsCompare } from './PermissionSetsCompare';

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
  <PermissionSetsCompare
    {...props}
  />,
  { wrapper },
);

jest.mock('./PermissionSetsCompareItem', () => ({
  PermissionSetsCompareItem: () => <span>PermissionSetsCompareItem</span>,
}));

describe('PermissionSetsCompare', () => {
  it('should render component', () => {
    renderComponent();
    expect(screen.getAllByText('PermissionSetsCompareItem').length).toBe(2);
  });
});
