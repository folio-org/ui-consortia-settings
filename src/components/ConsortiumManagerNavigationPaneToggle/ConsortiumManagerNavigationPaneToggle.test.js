import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiumManagerContextProviderMock } from 'helpers';
import { ConsortiumManagerNavigationPaneToggle } from './ConsortiumManagerNavigationPaneToggle';

const mockRestorePaneToggleFocus = jest.fn();
let mockIsRestorePaneToggleFocusAvailable = true;

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // `restorePaneToggleFocus` may be missing in older versions of stripes-smart-components
  get restorePaneToggleFocus() {
    return mockIsRestorePaneToggleFocusAvailable ? mockRestorePaneToggleFocus : undefined;
  },
}));

const PANE_TOGGLE_BUTTON_SELECTOR = '[data-testid="consortium-manager-navigation-pane-toggle-button"]';
const COLLAPSE_TOOLTIP = 'ui-consortia-settings.collapse.management.pane.button.tooltip';
const EXPAND_TOOLTIP = 'ui-consortia-settings.expand.management.pane.button.tooltip';

const renderComponent = (context = {}) => render(
  <ConsortiumManagerContextProviderMock
    context={{
      isNavigationPaneVisible: true,
      setIsNavigationPaneVisible: jest.fn(),
      ...context,
    }}
  >
    <ConsortiumManagerNavigationPaneToggle />
  </ConsortiumManagerContextProviderMock>,
);

describe('ConsortiumManagerNavigationPaneToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsRestorePaneToggleFocusAvailable = true;
  });

  it('should render collapse button when navigation pane is visible', () => {
    renderComponent({ isNavigationPaneVisible: true });

    expect(screen.getByRole('button', { name: COLLAPSE_TOOLTIP })).toBeInTheDocument();
  });

  it('should render expand button when navigation pane is hidden', () => {
    renderComponent({ isNavigationPaneVisible: false });

    expect(screen.getByRole('button', { name: EXPAND_TOOLTIP })).toBeInTheDocument();
  });

  it('should toggle navigation pane visibility and restore focus to the pane toggle button', async () => {
    const setIsNavigationPaneVisible = jest.fn();

    renderComponent({ setIsNavigationPaneVisible });

    await userEvent.click(screen.getByRole('button', { name: COLLAPSE_TOOLTIP }));

    expect(setIsNavigationPaneVisible).toHaveBeenCalledTimes(1);

    const updater = setIsNavigationPaneVisible.mock.calls[0][0];

    expect(updater(true)).toBe(false);
    expect(updater(false)).toBe(true);
    expect(mockRestorePaneToggleFocus).toHaveBeenCalledWith(PANE_TOGGLE_BUTTON_SELECTOR);
  });

  it('should toggle navigation pane visibility when restorePaneToggleFocus is not available', async () => {
    const setIsNavigationPaneVisible = jest.fn();

    mockIsRestorePaneToggleFocusAvailable = false;

    renderComponent({ setIsNavigationPaneVisible });

    await userEvent.click(screen.getByRole('button', { name: COLLAPSE_TOOLTIP }));

    expect(setIsNavigationPaneVisible).toHaveBeenCalledTimes(1);
    expect(mockRestorePaneToggleFocus).not.toHaveBeenCalled();
  });
});
