import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { StatisticalCodes } from './StatisticalCodes';

const renderStatisticalCodes = (props = {}) => render(
  <StatisticalCodes
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: 'b6b46869-f3c1-4370-b603-29774a1e42b1',
    code: 'arch',
    name: 'Archives (arch)',
    statisticalCodeTypeId: '0d3ec58e-dc3c-4aa1-9eba-180fca95c544',
    source: 'UC',
    metadata: {
      createdDate: '2023-06-08T13:06:34.691+00:00',
      createdByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
      updatedDate: '2023-06-08T13:06:34.691+00:00',
      updatedByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
    },
  },
  {
    id: 'c7a32c50-ea7c-43b7-87ab-d134c8371330',
    code: 'ASER',
    name: 'Active serial',
    statisticalCodeTypeId: '0d3ec58e-dc3c-4aa1-9eba-180fca95c544',
    source: 'UC',
    metadata: {
      createdDate: '2023-06-08T13:06:34.812+00:00',
      createdByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
      updatedDate: '2023-07-06T07:19:53.068+00:00',
      updatedByUserId: 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('StatisticalCodes', () => {
  it('should render controlled vocabulary list with statistical codes', async () => {
    renderStatisticalCodes();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should validate if a department code field is filled in', async () => {
      renderStatisticalCodes();

      await userEvent.click(screen.getByText('stripes-core.button.new'));
      await userEvent.click(screen.getByText('stripes-core.button.save'));

      expect(screen.getAllByText('stripes-core.label.missingRequiredField').length).toBeGreaterThan(0);
    });
  });
});
