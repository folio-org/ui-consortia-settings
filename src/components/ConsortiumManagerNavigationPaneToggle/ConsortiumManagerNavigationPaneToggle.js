import { PaneHeaderIconButton } from '@folio/stripes/components';

import { useCallback } from 'react';
import { useConsortiumManagerContext } from '../../contexts';

export const ConsortiumManagerNavigationPaneToggle = () => {
  const { isNavigationPaneVisible, setIsNavigationPaneVisible } = useConsortiumManagerContext();

  const togglePane = useCallback(() => {
    setIsNavigationPaneVisible(prev => !prev);
  }, [setIsNavigationPaneVisible]);

  return (
    <PaneHeaderIconButton
      icon={`caret-${isNavigationPaneVisible ? 'left' : 'right'}`}
      iconSize="medium"
      onClick={togglePane}
    />
  );
};
