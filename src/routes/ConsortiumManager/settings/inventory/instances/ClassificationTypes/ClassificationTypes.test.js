import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { ClassificationTypes } from './ClassificationTypes';

const renderClassificationTypes = (props = {}) => render(
  <ClassificationTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '74c08086-81a4-4466-93d8-d117ce8646db',
    name: 'Additional Dewey',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.625+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.625+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'ad615f6e-e28c-4343-b4a0-457397c5be3e',
    name: 'Canadian Classification',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.624+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.624+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('ClassificationTypes', () => {
  it('should render controlled vocabulary list with classification identifier types', async () => {
    renderClassificationTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
