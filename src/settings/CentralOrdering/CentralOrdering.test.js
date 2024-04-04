import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import { useCentralOrderingSettings } from '@folio/stripes-acq-components';

import { CentralOrdering } from './CentralOrdering';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div>Loading</div>,
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingSettings: jest.fn(),
}));

const renderCentralOrderingSettings = () => render(
  <CentralOrdering />,
  { wrapper: MemoryRouter },
);

const mockRefetch = jest.fn();
const mockKy = {
  put: jest.fn((_url, { data }) => ({
    json() {
      return Promise.resolve(data);
    },
  })),
};
const mockData = { id: 'setting-id' };

describe('BankingInformationSettings component', () => {
  beforeEach(() => {
    mockKy.put.mockClear();
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue({
        isFetching: false,
        enabled: false,
        refetch: mockRefetch,
      });
    useOkapiKy
      .mockClear()
      .mockReturnValue(mockKy);
  });

  it('should display pane headings', () => {
    renderCentralOrderingSettings();

    const paneTitle = screen.getByText('ui-consortia-settings.settings.centralOrdering.label');
    const checkboxLabel = screen.getByText('ui-consortia-settings.settings.centralOrdering.checkbox.label');

    expect(paneTitle).toBeInTheDocument();
    expect(checkboxLabel).toBeInTheDocument();
  });

  it('should render "Loading" component when settings are loading', () => {
    useCentralOrderingSettings.mockReturnValue({
      isLoading: true,
      enabled: false,
    });

    renderCentralOrderingSettings();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should handle central ordering settings submit', async () => {
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue({
        data: mockData,
        isLoading: false,
        enabled: true,
        refetch: mockRefetch,
      });

    renderCentralOrderingSettings();

    await user.click(await screen.findByRole('checkbox', { name: 'ui-consortia-settings.settings.centralOrdering.checkbox.label' }));
    await user.click(await screen.findByRole('button', { name: 'stripes-core.button.save' }));

    expect(mockKy.put).toHaveBeenCalled();
  });
});
