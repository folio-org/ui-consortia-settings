import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Membership } from './Membership';

const renderMembershipSettings = () => render(
  <Membership />,
  { wrapper: MemoryRouter },
);

describe('Membership', () => {
  it('should display controlled vocabulary setting', async () => {
    renderMembershipSettings();

    expect(screen.getByText('ui-consortia-settings.settings.membership.list.tenantName')).toBeInTheDocument();
    expect(screen.getByText('ui-consortia-settings.settings.membership.list.tenantAddress')).toBeInTheDocument();
    expect(screen.getByText('stripes-smart-components.editableList.actionsColumnHeader')).toBeInTheDocument();
  });
});
