import { PaneHeaderIconButton } from '@folio/stripes/components';

import { useConsortiumManagerContext } from '../../contexts';
import { useCallback } from 'react';

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
