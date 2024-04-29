import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import PermissionSetForm from './PermissionSetForm';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(() => 'ViewMetaData'),
}));
jest.mock('./PermissionsAccordion/PermissionsAccordion', () => jest.fn(() => 'PermissionsAccordion'));

const handleSubmit = () => ({});
const onRemove = () => ({});

const initialVal = {};
const initialValData = {
  id: '14c7a734-f029-4350-8fe0-0bbef7942ce5',
  displayName: 'test-permission-set',
  metadata: {
    createdDate: '',
  },
};
const stripes = {
  connect: jest.fn(c => c),
  hasPerm: jest.fn(() => true),
};

const renderPermissionSetForm = initialValues => {
  const component = (
    <Router>
      <PermissionSetForm
        stripes={stripes}
        handleSubmit={handleSubmit}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        onRemove={onRemove}
        tenantId="mobius"
      />
    </Router>
  );

  return render(component);
};

describe('PermissionSetForm', () => {
  it('show if component renders data with no inital values', () => {
    renderPermissionSetForm();

    expect(screen.getByText(/saveAndClose/)).toBeDefined();
  });
  it('show if component renders data with empty inital values', () => {
    renderPermissionSetForm(initialVal);

    expect(screen.getByText(/saveAndClose/)).toBeDefined();
  });
  it('Permission list check', () => {
    renderPermissionSetForm(initialVal);

    expect(screen.getByText('ui-users.permissions.newPermissionSet')).toBeDefined();
  });
  it('General info check', () => {
    renderPermissionSetForm(initialVal);

    expect(screen.getByText('ui-users.permissions.generalInformation')).toBeDefined();
  });
  it('description check', () => {
    renderPermissionSetForm(initialVal);

    expect(screen.getByText('ui-users.description')).toBeDefined();
  });
  it('oncancel delete modal check', () => {
    renderPermissionSetForm(initialValData);

    expect(screen.getByText('ui-users.delete')).toBeDefined();
    fireEvent.click(screen.getByText('ui-users.delete'));
    fireEvent.click(screen.getByText('stripes-components.cancel'));
  });
  it('delete check', () => {
    renderPermissionSetForm(initialValData);

    expect(screen.getByText('ui-users.delete')).toBeDefined();
    fireEvent.click(screen.getByText('ui-users.delete'));
    fireEvent.click(document.querySelector('[data-test-confirmation-modal-confirm-button="true"]'));
  });
  it('expand collapse check', () => {
    renderPermissionSetForm(initialValData);

    expect(screen.getByText('stripes-components.collapseAll')).toBeDefined();
    fireEvent.click(screen.getByText('stripes-components.collapseAll'));
  });
  it('toggle accordion check', () => {
    renderPermissionSetForm(initialValData);

    fireEvent.click(screen.getByText('ui-users.permissions.generalInformation'));
  });
});
