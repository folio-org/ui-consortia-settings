import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { MaterialTypes } from './MaterialTypes';

const renderMaterialTypes = (props = {}) => render(
  <MaterialTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '1a54b431-2e4f-452d-9cae-9cee66c9a892',
    name: 'book',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:44.137+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:44.137+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '5ee11d91-f7e8-481d-b079-65d708582ccc',
    name: 'dvd',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:44.229+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:44.229+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('MaterialTypes', () => {
  it('should render controlled vocabulary list with material types', async () => {
    renderMaterialTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
