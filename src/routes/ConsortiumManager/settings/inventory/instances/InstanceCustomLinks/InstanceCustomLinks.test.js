import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components'; 

import { ConsortiaControlledVocabularyWrapper } from 'helpers';
import { wrapConsortiaControlledVocabularyDescribe } from 'helpers/wrapConsortiaControlledVocabularyDescribe';

import { InstanceCustomLinks } from './InstanceCustomLinks';

const wrapper = ({ children }) => {
  return <ConsortiaControlledVocabularyWrapper>
    <Paneset>
      {children}
    </Paneset>
  </ConsortiaControlledVocabularyWrapper>;
};

const renderInstanceCustomLinks = (props = {}) => render(
  <InstanceCustomLinks
    {...props}
  />,
  { wrapper },
);

const entries = [
  {
    id: 'f2f56a6e-1d5e-4d8a-880f-d739cbf061ec',
    name: 'opac',
    linkText: 'Our OPAC',
    link: 'https://opac.example.org/{{UUID}}',
    show: true,
    source: 'local',
    metadata: {
      createdDate: '2023-06-26T13:23:52.330+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.330+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
  {
    id: 'a2538962-41d0-4142-8146-4d0c471e7766',
    name: 'reviews',
    linkText: 'External Reviews',
    link: 'https://reviews.example.org/view/{{HRID}}',
    show: false,
    source: 'consortium',
    metadata: {
      createdDate: '2023-06-26T13:23:52.234+00:00',
      createdByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
      updatedDate: '2023-06-26T13:23:52.234+00:00',
      updatedByUserId: '557dbab7-f610-43f1-85b4-c1f9db077959',
    },
  },
];

wrapConsortiaControlledVocabularyDescribe({ entries })('InstanceCustomLinks', () => {
  it('should render controlled vocabulary list with instance custom links', async () => {
    renderInstanceCustomLinks();

    entries.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('should render the show field as a checkbox', async () => {
    renderInstanceCustomLinks();

    expect(await screen.findAllByRole('checkbox', { checked: true })).toHaveLength(1);
    expect(await screen.findAllByRole('checkbox', { checked: false })).toHaveLength(1);
  });

  it('should validate required fields', async () => {
    renderInstanceCustomLinks();

    await userEvent.click(screen.getByText('stripes-core.button.new'));
    await userEvent.click(screen.getByText('stripes-core.button.save'));

    expect(screen.getByText('stripes-core.label.missingRequiredField')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.instanceCustomLinks.error.linkTextRequired')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.instanceCustomLinks.error.linkRequired')).toBeInTheDocument();
  });
});
