import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { Form, Field } from 'react-final-form';

import EnableUnassignAll from './EnableUnassignAll';

const onChangeMock = jest.fn();

const enableUnassignAllProps = {
  callback: onChangeMock,
  isEnabled: true,
  permissionsField: 'permissions',
};

const renderEnableUnassignAll = ({ name }) => {
  const component = () => (
    <>
      <Field component="input" name={name} />
      <EnableUnassignAll {...enableUnassignAllProps} />
    </>
  );

  render(<Form onSubmit={jest.fn()} render={component} />);
};

describe('EnableUnassignAll', () => {
  test('should', () => {
    renderEnableUnassignAll({ name: 'permissions' });

    const element = screen.getByRole('textbox');

    fireEvent.change(element, { target: { value: 'test' } });

    expect(onChangeMock).toHaveBeenCalled();
  });
});
