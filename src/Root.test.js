import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { MODULE_ROOT_ROUTE } from './constants';
import Root from './Root';

jest.mock('./settings', () => jest.fn(() => 'ConsortiumSettings'));
jest.mock('./routes', () => ({
  ConsortiumManager: jest.fn(() => 'ConsortiumManager'),
}));

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
