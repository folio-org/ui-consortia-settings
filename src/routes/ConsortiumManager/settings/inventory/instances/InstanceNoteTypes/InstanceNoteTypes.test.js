import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { InstanceNoteTypes } from './InstanceNoteTypes';

const renderInstanceNoteTypes = (props = {}) => render(
  <InstanceNoteTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: 'a6a5550f-4981-4b48-b821-a57d5c8ca3b3',
    name: 'Accessibility note',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:52.330+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.330+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '1c7acba3-523d-4237-acd2-e88549bfc660',
    name: 'Accumulation and Frequency of Use note',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:52.234+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.234+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('InstanceNoteTypes', () => {
  it('should render controlled vocabulary list with instance note types', async () => {
    renderInstanceNoteTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
