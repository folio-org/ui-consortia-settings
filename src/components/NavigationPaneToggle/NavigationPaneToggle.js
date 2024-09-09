import { PaneHeaderIconButton } from '@folio/stripes/components';

import { useConsortiumManagerContext } from '../../contexts';

export const NavigationPaneToggle = () => {
  const { isNavigationPaneVisible, toggleNavigationPane } = useConsortiumManagerContext();

  return (
    <PaneHeaderIconButton
      icon={`caret-${isNavigationPaneVisible ? 'left' : 'right'}`}
      iconSize="medium"
      onClick={toggleNavigationPane}
    />
  );
};
