import { MemoryRouter } from 'react-router-dom';

import { ConsortiumManagerContextProviderMock } from './ConsortiumManagerContextProviderMock';

export const ConsortiaControlledVocabularyWrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);
