import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { HoldingsTypes } from './HoldingsTypes';

const renderHoldingsTypes = (props = {}) => render(
  <HoldingsTypes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '996f93e2-5b5e-4cf2-9168-33ced1f95eed',
    name: 'Electronic',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:51.622+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:51.622+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '03c9c400-b9e3-4a07-ac0e-05ab470233ed',
    name: 'Monograph',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:51.623+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:51.623+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('HoldingsTypes', () => {
  it('should render controlled vocabulary list with holdings types', async () => {
    renderHoldingsTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
