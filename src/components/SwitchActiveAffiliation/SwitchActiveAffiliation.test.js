import { MemoryRouter } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  updateTenant,
  useModules,
  getEventHandler,
} from '@folio/stripes/core';

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
  useModules: jest.fn(),
  getEventHandler: jest.fn(),
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

    getEventHandler.mockClear();

    useModules
      .mockClear()
      .mockReturnValue({
        app: [{ route: '/' }],
        settings: [],
        handler: [],
      });
  });

  it('should render \'Switch active affiliation\' modal', () => {
    renderSwitchActiveAffiliation();

    expect(screen.getByText('ui-consortia-settings.switchActiveAffiliation.modal.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-consortia-settings.switchActiveAffiliation.modal.select.label')).toBeInTheDocument();
    expect(screen.getByText(/saveAndClose/)).toBeInTheDocument();
  });

  it('should change active affiliation', async () => {
    renderSwitchActiveAffiliation();

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText(tenants[2].name));
    await userEvent.click(screen.getByText(/saveAndClose/));

    expect(updateTenant).toHaveBeenCalledWith(
      defaultProps.stripes.okapi,
      tenants[2].id,
    );
  });

  describe('when user selects another affiliation', () => {
    it('should notify all "handler" modules', async () => {
      useModules.mockReturnValue({
        handler: [
          { module: '@folio/marc-authority' },
          { module: '@folio/inventory' },
        ],
      });

      renderSwitchActiveAffiliation();

      await userEvent.click(screen.getByRole('button', { name: /switchActiveAffiliation.modal.select.label/ }));
      await userEvent.click(screen.getByText(tenants[2].name));
      await userEvent.click(screen.getByText(/saveAndClose/));

      expect(getEventHandler).toHaveBeenNthCalledWith(
        1,
        'SWITCH_ACTIVE_AFFILIATION',
        defaultProps.stripes,
        { module: '@folio/marc-authority' },
      );

      expect(getEventHandler).toHaveBeenNthCalledWith(
        2,
        'SWITCH_ACTIVE_AFFILIATION',
        defaultProps.stripes,
        { module: '@folio/inventory' },
      );
    });
  });
});
