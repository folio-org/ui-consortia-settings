import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { buildStripesObject } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { AlternativeTitleTypes } from './AlternativeTitleTypes';

const defaultProps = {
  stripes: buildStripesObject(),
};

const renderAlternativeTitleTypes = (props = {}) => render(
  <AlternativeTitleTypes
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '2ca8538d-a2fd-4e60-b967-1cb220101e22',
    name: 'Added title page title',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:51.337+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:51.337+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '432ca81a-fe4d-4249-bfd3-53388725647d',
    name: 'Caption title',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:51.416+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:51.416+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('AlternativeTitleTypes', () => {
  it('should render controlled vocabulary list with alternative title types', async () => {
    renderAlternativeTitleTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
