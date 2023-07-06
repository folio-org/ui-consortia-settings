import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { LoanTypes } from './LoanTypes';

const renderLoanTypes = (props = {}) => render(
  <LoanTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '2b94c631-fca9-4892-a730-03ee529ffe27',
    name: 'Can circulate',
    metadata: {
      createdDate: '2023-06-26T13:23:44.320+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:44.320+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'e8b311a6-3b21-43f2-a269-dd9310cb2d0e',
    name: 'Course reserves',
    metadata: {
      createdDate: '2023-06-26T13:23:44.319+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:44.319+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('LoanTypes', () => {
  it('should render controlled vocabulary list with loan types', async () => {
    renderLoanTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
