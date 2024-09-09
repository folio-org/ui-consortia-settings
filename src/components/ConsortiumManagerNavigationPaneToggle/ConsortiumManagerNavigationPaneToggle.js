import { PaneHeaderIconButton } from '@folio/stripes/components';

import { useConsortiumManagerContext } from '../../contexts';
import { useCallback } from 'react';

export const ConsortiumManagerNavigationPaneToggle = () => {
  const { isNavigationPaneVisible, setNavigationPaneVisible } = useConsortiumManagerContext();

  const togglePane = useCallback(() => {
    setNavigationPaneVisible(prev => !prev);
  }, [setNavigationPaneVisible]);

  return (
    <PaneHeaderIconButton
      icon={`caret-${isNavigationPaneVisible ? 'left' : 'right'}`}
      iconSize="medium"
      onClick={togglePane}
    />
  );
};
