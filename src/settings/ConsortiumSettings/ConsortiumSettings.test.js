import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ConsortiumSettings from './ConsortiumSettings';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  Settings: jest.fn(() => 'ConsortiumSettings'),
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
  it('should render consortium settings pane', () => {
    renderConsortiumSettings();

    expect(screen.getByText('ConsortiumSettings')).toBeInTheDocument();
  });
});
