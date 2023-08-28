import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';
import { ContributorTypes } from './ContributorTypes';

const renderContributorTypes = (props = {}) => render(
  <ContributorTypes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '28de45ae-f0ca-46fe-9f89-283313b3255b',
    name: 'Abridger',
    code: 'abr',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:48.336+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:48.336+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '7131e7b8-84fa-48bd-a725-14050be38f9f',
    name: 'Actor',
    code: 'act',
    source: 'marcrelator',
    metadata: {
      createdDate: '2023-06-26T13:23:47.022+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:47.022+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('ContributorTypes', () => {
  it('should render controlled vocabulary list with contributor types', async () => {
    renderContributorTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should validate required fields', async () => {
      renderContributorTypes();

      await userEvent.click(screen.getByText('stripes-core.button.new'));
      await userEvent.click(screen.getByText('stripes-core.button.save'));

      expect(screen.getAllByText('stripes-core.label.missingRequiredField')).toHaveLength(2);
    });
  });
});
