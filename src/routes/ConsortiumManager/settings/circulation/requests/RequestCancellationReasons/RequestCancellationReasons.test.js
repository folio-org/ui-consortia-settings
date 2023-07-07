import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { RequestCancellationReasons } from './RequestCancellationReasons';

const renderRequestCancellationReasons = (props = {}) => render(
  <RequestCancellationReasons
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '941c7055-04f8-4db3-82cb-f63965c1506f',
    name: 'INN-Reach',
    requiresAdditionalInformation: false,
    metadata: {
      createdDate: '2023-07-04T01:50:16.194+00:00',
      updatedDate: '2023-07-04T01:50:16.194+00:00',
    },
  },
  {
    id: 'ff474f60-d9ce-4bd8-8659-eb51af825a56',
    name: 'Item Not Available',
    description: 'Item is no longer available',
    requiresAdditionalInformation: false,
    metadata: {
      createdDate: '2023-07-04T01:48:50.958+00:00',
      updatedDate: '2023-07-04T01:48:50.958+00:00',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('RequestCancellationReasons', () => {
  it('should render controlled vocabulary list with request cancellation reasons', async () => {
    renderRequestCancellationReasons();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
