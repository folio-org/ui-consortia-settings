import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { StatisticalCodeTypes } from './StatisticalCodeTypes';

const renderStatisticalCodeTypes = (props = {}) => render(
  <StatisticalCodeTypes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '3abd6fc2-b3e4-4879-b1e1-78be41769fe3',
    name: 'ARL (Collection stats)',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.825+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.825+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'd816175b-578f-4056-af61-689f449c3c45',
    name: 'DISC (Discovery)',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.823+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.823+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('StatisticalCodeTypes', () => {
  it('should render controlled vocabulary list with statistical code types', async () => {
    renderStatisticalCodeTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
