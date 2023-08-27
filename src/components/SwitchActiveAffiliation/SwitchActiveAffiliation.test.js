import { MemoryRouter } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { updateTenant } from '@folio/stripes/core';

import { tenants } from 'fixtures';
import { useUserAffiliations } from '../../hooks';
import { SwitchActiveAffiliation } from './SwitchActiveAffiliation';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUserAffiliations: jest.fn(() => ({ affiliations: [], isFetching: false })),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getCurrentModulePath: jest.fn(() => 'https://folio.org'),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  updateTenant: jest.fn(),
  useModules: jest.fn(() => ({ app: [{ route: '/' }], settings: [] })),
}));

const defaultProps = {
  stripes: {
    store: {},
    user: {
      user: {
        id: 'user-id',
      },
    },
    okapi: {
      tenant: 'college',
    },
  },
};

const affiliations = tenants.map(({ id, name }) => ({
  id: `${id}-${name}`,
  tenantId: id,
  tenantName: name,
  userId: 'userId',
  username: 'admin',
}));

const renderSwitchActiveAffiliation = (props = {}) => render(
  <SwitchActiveAffiliation
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('SwitchActiveAffiliation', () => {
  beforeEach(() => {
    useUserAffiliations
      .mockClear()
      .mockReturnValue({
        isFetching: false,
        affiliations,
      });
  });

  it('should render \'Switch active affiliation\' modal', () => {
    renderSwitchActiveAffiliation();

    expect(screen.getByText('ui-consortia-settings.switchActiveAffiliation.modal.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-consortia-settings.switchActiveAffiliation.modal.select.label')).toBeInTheDocument();
    expect(screen.getByText('ui-consortia-settings.button.saveAndClose')).toBeInTheDocument();
  });

  it('should change active affiliation', async () => {
    renderSwitchActiveAffiliation();

    await userEvent.click(screen.getByText(tenants[2].name));
    await userEvent.click(screen.getByText('ui-consortia-settings.button.saveAndClose'));

    expect(updateTenant).toHaveBeenCalledWith(
      defaultProps.stripes.okapi,
      tenants[2].id,
    );
  });
});
