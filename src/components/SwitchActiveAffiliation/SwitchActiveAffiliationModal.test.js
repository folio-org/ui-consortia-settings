import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { tenants } from 'fixtures';
import { SwitchActiveAffiliationModal } from './SwitchActiveAffiliationModal';

const defaultProps = {
  activeAffiliation: tenants[0].id,
  dataOptions: tenants.map(({ id, name }) => ({ label: name, value: id })),
  isLoading: false,
  onChangeActiveAffiliation: jest.fn(),
  onSubmit: jest.fn(),
  open: true,
  toggle: jest.fn(),
};

const renderSwitchActiveAffiliationModal = (props = {}) => render(
  <SwitchActiveAffiliationModal
    {...defaultProps}
    {...props}
  />,
);

describe('SwitchActiveAffiliationModal', () => {
  it('should render selection options', async () => {
    renderSwitchActiveAffiliationModal();

    await userEvent.click(screen.getByRole('button', { name: /switchActiveAffiliation.modal.select.label/ }));

    expect(screen.getAllByText(tenants[0].name)).toHaveLength(2);
    tenants.slice(1).forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
