import { render, screen } from '@testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { ItemNoteTypes } from './ItemNoteTypes';

const renderItemNoteTypes = (props = {}) => render(
  <ItemNoteTypes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '0e40884c-3523-4c6d-8187-d578e3d2794e',
    name: 'Action note',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:52.623+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.623+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '87c450be-2033-41fb-80ba-dd2409883681',
    name: 'Binding',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:52.627+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.627+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('ItemNoteTypes', () => {
  it('should render controlled vocabulary list with item note types', async () => {
    renderItemNoteTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
