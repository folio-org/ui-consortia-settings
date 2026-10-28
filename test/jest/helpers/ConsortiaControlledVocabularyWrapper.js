import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { ConsortiumManagerContextProviderMock } from './ConsortiumManagerContextProviderMock';

export const ConsortiaControlledVocabularyWrapper = ({ children, context }) => (
  <MemoryRouter>
    <IntlProvider
      locale="en"
      messages={{}}
    >
      <ConsortiumManagerContextProviderMock context={context}>
        {children}
      </ConsortiumManagerContextProviderMock>
    </IntlProvider>
  </MemoryRouter>
);
