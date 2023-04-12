import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  consortium,
  tenants,
} from '../../../test/jest/fixtures';
import Membership from './Membership';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn().mockReturnValue('ControlledVocab'));

const defaultProps = {
  stripes: {
    hasPerm: jest.fn(),
    connect: jest.fn(),
  },
  resources: {
    values: {
      records: tenants,
    },
  },
  mutator: {
    values: {
      GET: jest.fn(),
      PUT: jest.fn(),
    },
  },
  consortium: {
    ...consortium,
    isLoading: false,
  },
};

const renderMembershipSettings = (props = {}) => render(
  <Membership
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('Membership', () => {
  it('should display loading pane while consortium data is loading', () => {
    renderMembershipSettings({ consortium: { ...consortium, isLoading: true } });

    expect(screen.queryByText('ControlledVocab')).not.toBeInTheDocument();
  });

  it('should display controlled vocabulary setting', () => {
    renderMembershipSettings();

    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });
});
