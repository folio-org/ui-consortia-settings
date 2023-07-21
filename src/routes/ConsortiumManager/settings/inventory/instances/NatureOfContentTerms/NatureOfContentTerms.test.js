import { render, screen } from '@testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { NatureOfContentTerms } from './NatureOfContentTerms';

const renderNatureOfContentTerms = (props = {}) => render(
  <NatureOfContentTerms
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '96879b60-098b-453b-bf9a-c47866f1ab2a',
    name: 'audiobook',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.444+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.444+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '04a6a8d2-f902-4774-b15f-d8bd885dc804',
    name: 'autobiography',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.430+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.430+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('NatureOfContentTerms', () => {
  it('should render controlled vocabulary list with nature of content terms', async () => {
    renderNatureOfContentTerms();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
