import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';
import { Formats } from './Formats';

const renderFormats = (props = {}) => render(
  <Formats
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '0d9b1c3d-2d13-4f18-9472-cc1b91bf1752',
    name: 'audio -- audio belt',
    code: 'sb',
    source: 'rdacarrier',
    metadata: {
      createdDate: '2023-06-26T13:23:49.818+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:49.818+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: '5642320a-2ab9-475c-8ca2-4af7551cf296',
    name: 'audio -- audio cartridge',
    code: 'sg',
    source: 'local',
    metadata: {
      createdDate: '2023-06-26T13:23:49.931+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:49.931+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('Formats', () => {
  it('should render controlled vocabulary list with instance formats', async () => {
    renderFormats();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should validate required fields', () => {
      renderFormats();

      userEvent.click(screen.getByText('stripes-core.button.new'));
      userEvent.click(screen.getByText('stripes-core.button.save'));

      expect(screen.getAllByText('stripes-core.label.missingRequiredField')).toHaveLength(2);
    });
  });
});
