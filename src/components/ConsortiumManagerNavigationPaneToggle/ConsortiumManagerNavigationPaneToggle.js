import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  PaneHeaderIconButton,
  Tooltip,
} from '@folio/stripes/components';
import { restorePaneToggleFocus } from '@folio/stripes/smart-components';

import { useConsortiumManagerContext } from '../../contexts';
import css from './ConsortiumManagerNavigationPaneToggle.css';

// The button that triggers the toggle is unmounted/replaced by its counterpart
// (expand <-> collapse), rendered in a different, always-mounted pane, as a
// result of this action. See STCOM-1521.
const PANE_TOGGLE_BUTTON_SELECTOR = '[data-testid="consortium-manager-navigation-pane-toggle-button"]';

export const ConsortiumManagerNavigationPaneToggle = () => {
  const intl = useIntl();
  const { isNavigationPaneVisible, setIsNavigationPaneVisible } = useConsortiumManagerContext();

  const togglePane = useCallback(() => {
    setIsNavigationPaneVisible(prev => !prev);
    restorePaneToggleFocus?.(PANE_TOGGLE_BUTTON_SELECTOR);
  }, [setIsNavigationPaneVisible]);

  return (
    <Tooltip
      text={intl.formatMessage({
          id: isNavigationPaneVisible 
            ? 'ui-consortia-settings.collapse.management.pane.button.tooltip' 
            : 'ui-consortia-settings.expand.management.pane.button.tooltip'
      })}
      id="toggle-management-pane-button-tooltip"
    >
      {({ ref, ariaIds }) => (
        <PaneHeaderIconButton
          ref={ref}
          aria-labelledby={ariaIds.text}
          data-testid="consortium-manager-navigation-pane-toggle-button"
          icon={`caret-${isNavigationPaneVisible ? 'left' : 'right'}`}
          iconSize="medium"
          onClick={togglePane}
        />
      )}
    </Tooltip>
  );
};
