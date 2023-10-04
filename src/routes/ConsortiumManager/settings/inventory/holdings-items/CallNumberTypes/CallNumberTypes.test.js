import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { CallNumberTypes } from './CallNumberTypes';

const renderCallNumberTypes = (props = {}) => render(
  <CallNumberTypes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: 'ef03d582-219c-4221-8635-bc92f1107021',
    name: 'Shelving control number',
    source: 'folio',
    metadata: {
      createdDate: '2023-10-04T13:23:51.432+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-10-04T13:23:51.432+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'f50c90c9-bae0-4add-9cd0-db9092dbc9dd',
    name: 'Library of Congress classification',
    source: 'system',
    metadata: {
      createdDate: '2023-10-04T13:23:51.430+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-10-04T13:23:51.430+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('CallNumberTypes', () => {
  it('should render controlled vocabulary list with call number types', async () => {
    renderCallNumberTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
