import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { PatronGroups } from './PatronGroups';

const renderPatronGroups = (props = {}) => render(
  <PatronGroups
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const entries = [
  {
    group: '1245',
    desc: 'Faculty Member',
    id: '503a81cd-6c26-400f-b620-14c08943697c',
    expirationOffsetInDays: 365,
    metadata: {
      createdDate: '2023-06-08T13:09:04.109+00:00',
      createdByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
      updatedDate: '2023-06-26T11:38:15.335+00:00',
      updatedByUserId: 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
    },
  },
  {
    group: 'graduate',
    desc: 'Graduate Student',
    id: 'ad0bc554-d5bc-463c-85d1-5562127ae91b',
    metadata: {
      createdDate: '2023-06-08T13:09:04.093+00:00',
      createdByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
      updatedDate: '2023-06-08T13:09:04.093+00:00',
      updatedByUserId: 'a87c71a3-e931-42b8-9b6a-508208a30234',
    },
  },
  {
    group: 'save',
    id: 'cf7dbbac-3ef6-473d-90a0-4c3c1e8b011c',
    metadata: {
      createdDate: '2023-06-26T05:23:55.914+00:00',
      createdByUserId: 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
      updatedDate: '2023-06-26T05:23:55.914+00:00',
      updatedByUserId: 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('PatronGroups', ({ mutations }) => {
  it('should render controlled vocabulary list with patron groups', async () => {
    renderPatronGroups();

    entries.forEach(({ group }) => {
      expect(screen.getByText(group)).toBeInTheDocument();
    });
  });

  it('should validate row inputs', async () => {
    renderPatronGroups();

    userEvent.click(screen.getByText('stripes-core.button.new'));
    userEvent.type(screen.getByPlaceholderText('expirationOffsetInDays'), '-1');
    userEvent.click(screen.getByText('stripes-core.button.save'));

    expect(mutations.createEntry).not.toHaveBeenCalled();
    expect(await screen.findByText('stripes-core.label.missingRequiredField')).toBeInTheDocument();
    expect(await screen.findByText('ui-users.information.patronGroup.expirationOffset.error')).toBeInTheDocument();
  });
});
