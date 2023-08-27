import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { ResourceIdentifierTypes } from './ResourceIdentifierTypes';

const renderResourceIdentifierTypes = (props = {}) => render(
  <ResourceIdentifierTypes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '7f907515-a1bf-4513-8a38-92e1a07c539d',
    name: 'ASIN',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:44.537+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:44.537+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '3187432f-9434-40a8-8782-35a111a1491e',
    name: 'BNB',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:44.637+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:44.637+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('ResourceIdentifierTypes', () => {
  it('should render controlled vocabulary list with resource identifier types', async () => {
    renderResourceIdentifierTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
