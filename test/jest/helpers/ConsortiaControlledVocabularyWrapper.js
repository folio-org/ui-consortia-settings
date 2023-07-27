import { MemoryRouter } from 'react-router-dom';

import { ConsortiumManagerContextProviderMock } from './ConsortiumManagerContextProviderMock';

export const ConsortiaControlledVocabularyWrapper = ({ children, context }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock context={context}>
      {children}
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);
