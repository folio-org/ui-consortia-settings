import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';
import { InstanceStatusTypes } from './InstanceStatusTypes';

const renderInstanceStatusTypes = (props = {}) => render(
  <InstanceStatusTypes
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    id: '52a2ff34-2a12-420d-8539-21aa8d3cf5d8',
    code: 'batch',
    name: 'Batch Loaded',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.735+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.735+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '9634a5ab-9228-4703-baf2-4d12ebc77d56',
    code: 'cat',
    name: 'Cataloged',
    source: 'folio',
    metadata: {
      createdDate: '2023-06-26T13:23:50.726+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:50.726+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('InstanceStatusTypes', () => {
  it('should render controlled vocabulary list with instance status types', async () => {
    renderInstanceStatusTypes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should validate required fields', () => {
      renderInstanceStatusTypes();

      userEvent.click(screen.getByText('stripes-core.button.new'));
      userEvent.click(screen.getByText('stripes-core.button.save'));

      expect(screen.getAllByText('stripes-core.label.missingRequiredField')).toHaveLength(2);
    });
  });
});
