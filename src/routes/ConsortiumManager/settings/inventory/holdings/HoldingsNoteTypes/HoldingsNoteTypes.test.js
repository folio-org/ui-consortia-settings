import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { HoldingsNoteTypes } from './HoldingsNoteTypes';

const renderHoldingsNoteTypes = (props = {}) => render(
  <HoldingsNoteTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: 'd6510242-5ec3-42ed-b593-3585d2e48fd6',
    name: 'Action note',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:52.526+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.526+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'e19eabab-a85c-4aef-a7b2-33bd9acef24e',
    name: 'Test',
    source: 'local',
    metadata: {
      createdDate: '2023-06-26T13:23:52.526+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.526+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('HoldingsNoteTypes', () => {
  it('should render controlled vocabulary list with holdings note types', async () => {
    renderHoldingsNoteTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
