import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { IfPermission } from '@folio/stripes/core';

import PermissionsAccordion from './PermissionsAccordion';

jest.unmock('@folio/stripes/components');
jest.mock('@folio/stripes/core', () => ({
  IfPermission: jest.fn(({ children }) => <>{children}</>),
  stripesConnect: jest.fn(c => c),
}));
jest.mock('../IfConsortiumPermission', () => ({
  IfConsortiumPermission: jest.fn(({ children }) => <>{children}</>),
}));

const changeFormMock = jest.fn();
const paProps = {
  accordionId: 'permissions-accordion',
  expanded: true,
  filtersConfig: [],
  form: {
    getFieldState: () => ({
      value: [
        { 'name': 'foo' },
      ],
    }),
  },
  formName: 'userForm',
  headlineContent: <span>headline</span>,
  onToggle: jest.fn(),
  permToRead: 'perms.users.get',
  permToDelete: 'perms.users.item.delete',
  permToModify: 'perms.users.item.put',
  permissionsField: 'permissions',
  visibleColumns: [],
  stripes: {
    hasPerm: jest.fn(() => true),
  },
};

jest.mock('./components/PermissionsModal', () => {
  // eslint-disable-next-line react/prop-types
  return ({ open }) => (open ? <div>PermissionsModal</div> : null);
});

const renderPermissionsAccordion = (extraProps = {}) => render(<PermissionsAccordion {...paProps} {...extraProps} />);

describe('PermissionsAccordion', () => {
  test('lists permissions', async () => {
    renderPermissionsAccordion({
      stripes: {
        hasPerm: (p) => p === paProps.permToRead,
      },
    });

    expect(screen.getByTestId(paProps.accordionId)).toBeTruthy();
  });

  test('lists permissions', async () => {
    renderPermissionsAccordion({
      form: {
        getFieldState: () => ({
          value: [
            { name: 'foo', visible: true },
            { name: 'bar', visible: false },
          ],
        }),
      },
    });

    expect(screen.getByTestId(paProps.accordionId)).toBeTruthy();
  });

  test('without credentials, renders nothing', async () => {
    renderPermissionsAccordion({
      permToRead: 'funky-chicken',
      stripes: {
        hasPerm: (p) => p === paProps.permToRead,
      },
    });

    expect(screen.queryByTestId(paProps.accordionId)).not.toBeInTheDocument();
  });

  test('without credentials, hides add-permission button', async () => {
    IfPermission.mockImplementation(({ perm, children }) => {
      return (perm === paProps.permToModify) ? children : null;
    });

    renderPermissionsAccordion({
      permToModify: 'funky-chicken',
    });

    expect(screen.queryByText('ui-users.permissions.addPermission')).not.toBeInTheDocument();
  });

  describe('with credentials', () => {
    test('shows add-permission button', async () => {
      IfPermission.mockImplementation(({ perm, children }) => {
        return (perm === paProps.permToModify) ? children : null;
      });

      renderPermissionsAccordion();

      expect(screen.getByText('ui-users.permissions.addPermission')).toBeInTheDocument();
    });

    describe('when only "visible: true" permissions are assigned', () => {
      test('shows permissions-dialog', async () => {
        renderPermissionsAccordion();

        expect(screen.queryByText('PermissionsModal')).not.toBeInTheDocument();
        userEvent.click(screen.getByText('ui-users.permissions.addPermission'));
        expect(await screen.findByText('PermissionsModal')).toBeInTheDocument();
      });
    });

    describe('when click "Unassign all permissions" button', () => {
      test('unassign modal window should be shown', async () => {
        renderPermissionsAccordion();

        const unassignAllButton = await screen.findByRole('button', { name: 'ui-users.permissions.unassignAllPermissions' });

        userEvent.click(unassignAllButton);

        expect(await screen.findByText('ui-users.permissions.modal.unassignAll.header')).toBeInTheDocument();
      });

      describe('when confirm unassigning', () => {
        test('unassign function should be called', async () => {
          renderPermissionsAccordion({
            form: {
              getFieldState: () => ({
                value: [
                  { name: 'foo', visible: true },
                  { name: 'bar', visible: false },
                ],
              }),
              change: changeFormMock,
            },
          });

          const unassignAllButton = await screen.findByRole('button', { name: 'ui-users.permissions.unassignAllPermissions' });

          userEvent.click(unassignAllButton);

          const confirmButton = await screen.findByRole('button', { name: 'ui-users.yes' });

          userEvent.click(confirmButton);

          expect(changeFormMock).toHaveBeenCalled();
        });
      });

      describe('when cancel unassigning', () => {
        test('unassign modal window should be closed', async () => {
          renderPermissionsAccordion();

          const unassignAllButton = await screen.findByRole('button', { name: 'ui-users.permissions.unassignAllPermissions' });

          userEvent.click(unassignAllButton);

          const cancelButton = await screen.findByRole('button', { name: 'ui-users.no' });

          userEvent.click(cancelButton);

          await waitForElementToBeRemoved(() => screen.getByText('ui-users.permissions.modal.unassignAll.header'));

          expect(await screen.queryByText('ui-users.permissions.modal.unassignAll.header')).not.toBeInTheDocument();
        });
      });
    });
  });
});
