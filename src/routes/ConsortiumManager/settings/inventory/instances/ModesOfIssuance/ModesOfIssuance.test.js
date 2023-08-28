import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { ModesOfIssuance } from './ModesOfIssuance';

const renderModesOfIssuance = (props = {}) => render(
  <ModesOfIssuance
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '4fc0f4fe-06fd-490a-a078-c4da1754e03a',
    name: 'integrating resource',
    source: 'rdamodeissue',
    metadata: {
      createdDate: '2023-06-26T13:23:51.227+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:51.227+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'f5cc2ab6-bb92-4cab-b83f-5a3d09261a41',
    name: 'multipart monograph',
    source: 'rdamodeissue',
    metadata: {
      createdDate: '2023-06-26T13:23:51.224+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:51.224+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('ModesOfIssuance', () => {
  it('should render controlled vocabulary list with modes of issuance', async () => {
    renderModesOfIssuance();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
