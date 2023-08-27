import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { consortium } from 'fixtures';
import { useCurrentConsortium } from '../../hooks';
import ConsortiumSettings from './ConsortiumSettings';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  CommandList: jest.fn(({ children }) => <>{children}</>),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  Settings: jest.fn(() => 'ConsortiumSettings'),
}));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCurrentConsortium: jest.fn(() => ({ consortium: {}, isLoading: false })),
}));

const defaultProps = {
  history: {
    push: jest.fn(),
  },
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderConsortiumSettings = (props = {}) => render(
  <ConsortiumSettings
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ConsortiumSettings', () => {
  beforeEach(() => {
    useCurrentConsortium.mockClear().mockReturnValue({ consortium, isLoading: false });
  });

  it('should render consortium settings pane', () => {
    renderConsortiumSettings();

    expect(screen.getByText('ConsortiumSettings')).toBeInTheDocument();
  });
});
