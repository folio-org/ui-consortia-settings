import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { tenants } from 'fixtures';
import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';
import { ConsortiaControlledVocabulary } from './ConsortiaControlledVocabulary';

jest.unmock('react-final-form-arrays');

const path = 'some-storage/entries';
const records = 'items';
const response = {
  [records]: [
    {
      id: 'test-id-1',
      foo: 'foo-1',
      bar: 'bar-1',
      metadata: {
        createdDate: '2023-06-08T13:09:04.109+00:00',
        createdByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
        updatedDate: '2023-06-26T11:38:15.335+00:00',
        updatedByUserId: 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
      },
    },
    {
      id: 'test-id-2',
      foo: 'foo-2',
      bar: 'bar-2',
      metadata: {
        createdDate: '2023-06-08T13:09:04.109+00:00',
        createdByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
        updatedDate: '2023-06-26T11:38:15.335+00:00',
        updatedByUserId: 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
      },
    },
  ],
};

const defaultProps = {
  columnMapping: {
    foo: 'First column',
    bar: 'Second column',
  },
  label: 'Test vocabulary',
  path,
  records,
  translations: getControlledVocabTranslations('ui-app'),
  validate: jest.fn(),
  visibleFields: [
    'foo',
    'bar',
    'lastUpdated',
  ],
};

const renderConsortiaControlledVocabulary = (props = {}) => render(
  <ConsortiaControlledVocabulary
    {...defaultProps}
    {...props}
  />,
  { wrapper: ConsortiaControlledVocabularyWrapper },
);

wrapConsortiaControlledVocabularyDescribe({ entries: response[records] })('ConsortiaControlledVocabulary', ({ mutations }) => {
  it('should render consortia-related controlled vocabulary', () => {
    renderConsortiaControlledVocabulary();

    response[records].forEach(({ foo }) => {
      expect(screen.getByText(foo)).toBeInTheDocument();
    });
  });

  describe('Mutations', () => {
    it('should handle new record creation', async () => {
      renderConsortiaControlledVocabulary();

      userEvent.click(await screen.findByText('stripes-core.button.new'));
      userEvent.type(await screen.findByPlaceholderText('foo'), 'New');
      userEvent.type(await screen.findByPlaceholderText('bar'), 'Record');
      userEvent.click(await screen.findByText('stripes-core.button.save'));

      expect(mutations.createEntry).toHaveBeenCalledWith({
        entry: {
          foo: 'New',
          bar: 'Record',
        },
        tenants: tenants.slice(3).map(({ id }) => id),
      });
    });

    it('should handle record update', async () => {
      renderConsortiaControlledVocabulary();

      userEvent.click(screen.getAllByLabelText('stripes-components.editThisItem')[0]);

      const input = await screen.findByPlaceholderText('foo');

      userEvent.clear(input);
      userEvent.type(input, 'Updated');
      userEvent.click(await screen.findByText('stripes-core.button.save'));

      expect(mutations.updateEntry).toHaveBeenCalledWith({
        entry: {
          ...response[records][0],
          foo: 'Updated',
        },
      });
    });

    it('should handle record deletion', async () => {
      renderConsortiaControlledVocabulary();

      userEvent.click(screen.getAllByLabelText('stripes-components.deleteThisItem')[0]);

      // Confirmation modal
      expect(screen.getByText('ui-app.termWillBeDeleted')).toBeInTheDocument();

      const confirmDeleteBtn = screen.getByText('stripes-core.button.delete');

      userEvent.click(confirmDeleteBtn);
      await waitForElementToBeRemoved(confirmDeleteBtn);

      expect(mutations.deleteEntry).toHaveBeenCalledWith({ entry: response[records][0] });
    });
  });

  describe('Validation', () => {
    it('should handle the absence of a primary field value', async () => {
      renderConsortiaControlledVocabulary();

      userEvent.click(await screen.findByText('stripes-core.button.new'));
      userEvent.click(await screen.findByText('stripes-core.button.save'));

      expect(screen.getByText('stripes-core.label.missingRequiredField')).toBeInTheDocument();
    });

    it('should render \'item in use\' modal', async () => {
      mutations.deleteEntry.mockClear().mockRejectedValue({ status: 422 });
      renderConsortiaControlledVocabulary();

      userEvent.click(screen.getAllByLabelText('stripes-components.deleteThisItem')[0]);

      expect(screen.getByText('ui-app.termWillBeDeleted')).toBeInTheDocument();

      const confirmDeleteBtn = screen.getByText('stripes-core.button.delete');

      userEvent.click(confirmDeleteBtn);
      await waitForElementToBeRemoved(confirmDeleteBtn);

      expect(screen.getByText('ui-app.cannotDeleteTermMessage')).toBeInTheDocument();
    });
  });
});
