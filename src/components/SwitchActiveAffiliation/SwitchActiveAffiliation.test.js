import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { updateConsortium } from '@folio/stripes/core';

import {
  consortium,
  tenants,
} from '../../../test/jest/fixtures';
import { useUserAffiliations } from '../../hooks';
import { SwitchActiveAffiliation } from './SwitchActiveAffiliation';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUserAffiliations: jest.fn(() => ({ affiliations: [], isFetching: false })),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  updateConsortium: jest.fn(),
  useModules: jest.fn(() => ({ app: [{ route: '/' }], settings: [] })),
}));

const defaultProps = {
  stripes: {
    store: {},
    consortium: {
      ...consortium,
      activeAffiliation: { tenantId: tenants[0].id },
      userPrimaryTenant: tenants[1].id,
    },
    user: {
      user: {
        id: 'user-id',
      },
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

  it('should change active affiliation', () => {
    renderSwitchActiveAffiliation();

    userEvent.click(screen.getByText(tenants[2].name));
    userEvent.click(screen.getByText('ui-consortia-settings.button.saveAndClose'));

    expect(updateConsortium).toHaveBeenCalledWith(
      defaultProps.stripes.store,
      expect.objectContaining({
        activeAffiliation: affiliations[2],
      }),
    );
  });
});
