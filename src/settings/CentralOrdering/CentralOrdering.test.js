import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import { useCentralOrderingSettings } from '@folio/stripes-acq-components';

import { CentralOrdering } from './CentralOrdering';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: () => <div>LoadingPane</div>,
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
  post: jest.fn((_url, { data }) => ({
    json: () => Promise.resolve(data),
  })),
  put: jest.fn((_url, { data }) => ({
    json: () => Promise.resolve(data),
  })),
};
const mockData = { id: 'setting-id' };
const confirmModalMessageRegEx = /alert.message .*confirmModal.message/;

const handleConfirmModal = (confirm = true) => {
  return user.click(screen.getByRole('button', { name: confirm ? /confirm/ : /cancel/ }));
};

const findCentralOrderingCheckbox = () => {
  return screen.findByRole('checkbox', { name: /checkbox.label/ });
};

describe('CentralOrdering', () => {
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

    const paneTitle = screen.getByText(/centralOrdering.label/);
    const checkboxLabel = screen.getByText(/checkbox.label/);

    expect(paneTitle).toBeInTheDocument();
    expect(checkboxLabel).toBeInTheDocument();
  });

  it('should render "Loading" component when settings are loading', () => {
    useCentralOrderingSettings.mockReturnValue({
      isFetching: true,
      enabled: false,
    });

    renderCentralOrderingSettings();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });

  it('should handle central ordering settings create', async () => {
    renderCentralOrderingSettings();

    await user.click(await findCentralOrderingCheckbox());
    expect(await screen.findByText(confirmModalMessageRegEx)).toBeInTheDocument();

    await handleConfirmModal();
    expect(await findCentralOrderingCheckbox()).toBeChecked();

    await user.click(await screen.findByRole('button', { name: /save/ }));
    expect(mockKy.post).toHaveBeenCalled();
  });

  it('should handle central ordering settings update', async () => {
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue({
        data: mockData,
        isFetching: false,
        enabled: false,
        refetch: mockRefetch,
      });

    renderCentralOrderingSettings();

    await user.click(await findCentralOrderingCheckbox());
    expect(await screen.findByText(confirmModalMessageRegEx)).toBeInTheDocument();

    await handleConfirmModal();
    expect(await findCentralOrderingCheckbox()).toBeChecked();

    await user.click(await screen.findByRole('button', { name: /save/ }));
    expect(mockKy.put).toHaveBeenCalled();
  });

  it('should NOT be checked if a user cancel confirmation modal', async () => {
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue({
        data: mockData,
        isFetching: false,
        enabled: false,
        refetch: mockRefetch,
      });

    renderCentralOrderingSettings();

    await user.click(await findCentralOrderingCheckbox());
    await handleConfirmModal(false);
    expect(await findCentralOrderingCheckbox()).not.toBeChecked();
  });

  it('should disable checkbox when central ordering is enabled', async () => {
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue({
        data: mockData,
        isFetching: false,
        enabled: true,
        refetch: mockRefetch,
      });

    renderCentralOrderingSettings();

    const checkbox = await findCentralOrderingCheckbox();

    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });
});
