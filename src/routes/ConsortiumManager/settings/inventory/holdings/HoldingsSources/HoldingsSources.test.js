import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { HoldingsSources } from './HoldingsSources';

const renderHoldingsSources = (props = {}) => render(
  <HoldingsSources {...props} />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: 'f32d531e-df79-46b3-8932-cdd35f7a2264',
    name: 'FOLIO',
    source: 'folio',
    metadata: {
      createdDate: '2023-10-22T23:54:24.964+00:00',
      createdByUserId: '8943a949-9fef-452c-b528-1c3b29f4a88d',
      updatedDate: '2023-10-22T23:54:24.964+00:00',
      updatedByUserId: '8943a949-9fef-452c-b528-1c3b29f4a88d',
    },
  },
  {
    id: '036ee84a-6afd-4c3c-9ad3-4a12ab875f59',
    name: 'MARC',
    source: 'folio',
    metadata: {
      createdDate: '2023-10-22T23:54:27.518+00:00',
      createdByUserId: '8943a949-9fef-452c-b528-1c3b29f4a88d',
      updatedDate: '2023-10-22T23:54:27.518+00:00',
      updatedByUserId: '8943a949-9fef-452c-b528-1c3b29f4a88d',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('HoldingsSources', () => {
  it('should render controlled vocabulary list with holdings sources', async () => {
    renderHoldingsSources();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
