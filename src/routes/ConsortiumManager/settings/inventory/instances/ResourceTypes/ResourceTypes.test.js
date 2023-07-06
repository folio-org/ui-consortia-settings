import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { ResourceTypes } from './ResourceTypes';

const renderResourceTypes = (props = {}) => render(
  <ResourceTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '3363cdb1-e644-446c-82a4-dc3a1d4395b9',
    name: 'cartographic dataset',
    code: 'crd',
    source: 'rdacontent',
    metadata: {
      createdDate: '2023-06-26T13:23:49.229+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:49.229+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '526aa04d-9289-4511-8866-349299592c18',
    name: 'cartographic image',
    code: 'cri',
    source: 'rdacontent',
    metadata: {
      createdDate: '2023-06-26T13:23:49.227+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:49.227+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('ResourceTypes', () => {
  it('should render controlled vocabulary list with resource types', async () => {
    renderResourceTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
