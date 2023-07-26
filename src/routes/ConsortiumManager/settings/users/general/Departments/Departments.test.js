import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import {
  buildStripesObject,
  ConsortiaControlledVocabularyWrapper,
} from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { Departments } from './Departments';

const defaultProps = {
  stripes: buildStripesObject(),
};

const renderDepartments = (props = {}) => render(
  <Departments
    {...defaultProps}
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

const entries = [
  {
    id: '3e188f20-aae4-453a-8e41-25d61bbc8c1b',
    name: 'test',
    code: 'afad',
    usageNumber: 1,
    metadata: {
      createdDate: '2023-07-04T07:35:13.179+00:00',
      createdByUserId: 'a231d8d7-d776-5214-9836-4382d11f80f1',
      updatedDate: '2023-07-04T07:35:13.179+00:00',
      updatedByUserId: 'a231d8d7-d776-5214-9836-4382d11f80f1',
    },
  },
  {
    id: '045dec3f-bc40-41ef-9733-8af71fa7a94f',
    name: 'test2',
    code: 'qwer',
    usageNumber: 0,
    metadata: {
      createdDate: '2023-07-04T07:36:05.108+00:00',
      createdByUserId: 'a231d8d7-d776-5214-9836-4382d11f80f1',
      updatedDate: '2023-07-04T07:36:05.108+00:00',
      updatedByUserId: 'a231d8d7-d776-5214-9836-4382d11f80f1',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('Departments', () => {
  it('should render controlled vocabulary list with patron groups', async () => {
    renderDepartments();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it.each([
      ['name'],
      ['code'],
    ])('should validate a department %s uniqueness', (fieldName) => {
      renderDepartments();

      userEvent.click(screen.getByText('stripes-core.button.new'));
      userEvent.type(screen.getByPlaceholderText(fieldName), entries[0][fieldName]);
      userEvent.click(screen.getByText('stripes-core.button.save'));

      expect(screen.getByText(`ui-users.settings.departments.${fieldName}.error`)).toBeInTheDocument();
    });

    it('should validate if a department code field is filled in', () => {
      renderDepartments();

      userEvent.click(screen.getByText('stripes-core.button.new'));
      userEvent.click(screen.getByText('stripes-core.button.save'));

      expect(screen.getByText('ui-users.settings.departments.code.required')).toBeInTheDocument();
    });
  });
});
