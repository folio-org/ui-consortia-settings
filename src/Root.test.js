import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import { Router } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import { affiliations, tenants } from 'fixtures';
import { MODULE_ROOT_ROUTE } from './constants';
import {
  useCurrentUserTenantsPermissions,
  useMembersSelection,
  useUserAffiliations,
} from './hooks';
import Root from './Root';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
  updateUser: jest.fn(),
}));
jest.mock('./hooks', () => ({
  useMembersSelection: jest.fn(),
  useCurrentUserTenantsPermissions: jest.fn(),
  useUserAffiliations: jest.fn(),
}));
jest.mock('./settings', () => jest.fn(() => 'ConsortiumSettings'));
jest.mock('./routes', () => ({
  ConsortiumManager: jest.fn(() => 'ConsortiumManager'),
}));

const stripes = {
  store: {},
  okapi: {},
  user: {},
};

const defaultProps = {
  showSettings: false,
};

const history = createMemoryHistory();

const wrapper = ({ children }) => (
  <Router history={history}>
    {children}
  </Router>
);

const renderRoot = (props = {}) => render(
  <Root
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('Root', () => {
  beforeEach(() => {
    useStripes.mockClear().mockReturnValue(stripes);
    useUserAffiliations.mockClear().mockImplementation((_params, options) => {
      const onSuccess = options.onSuccess || noop;

      onSuccess(affiliations);

      return { affiliations };
    });
    useCurrentUserTenantsPermissions.mockClear().mockReturnValue({ tenantsPermissions: {} });
    useMembersSelection.mockClear().mockReturnValue({
      members: tenants,
      initMembersSelection: jest.fn(),
      updateMembersSelection: jest.fn(),
    });
  });

  afterAll(() => {
    history.replace('/');
  });

  describe('App', () => {
    it('should render Consortium manager page', () => {
      history.push(MODULE_ROOT_ROUTE);
      renderRoot();

      expect(screen.getByText('ConsortiumManager')).toBeInTheDocument();
    });
  });

  describe('Settings', () => {
    it('should render Settings page', () => {
      renderRoot({ showSettings: true });

      expect(screen.getByText('ConsortiumSettings')).toBeInTheDocument();
    });
  });
});
