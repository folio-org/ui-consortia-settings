import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import PermissionsAccordionListItem from './PermissionsAccordionListItem';

jest.unmock('@folio/stripes/components');

jest.mock('@folio/stripes/util', () => ({
  ...jest.requireActual('@folio/stripes/util'),
  getPermissionLabelString: jest.fn((i) => i.permissionName),
}));

describe('PermissionsAccordionListItem', () => {
  test('displays a permission', async () => {
    const palProps = {
      item: {
        id: 123,
        permissionName: 'funky',
      },
      permToDelete: 'arugula',
      fields: {},
      changePermissions: jest.fn(),
    };

    render(<PermissionsAccordionListItem {...palProps} />);

    expect(screen.queryByText('funky')).toBeTruthy();
  });

  describe('handles remove button', () => {
    test('displays button given permission', async () => {
      const palProps = {
        item: {
          id: 123,
          permissionName: 'funky',
        },
        permToDelete: 'permission',
        fields: {},
        changePermissions: jest.fn(),
      };

      render(<PermissionsAccordionListItem {...palProps} />);
      expect(screen.getByRole('button')).toBeTruthy();
    });

    test('clicking button fires callback', async () => {
      const item = {
        id: 123,
        permissionName: 'funky',
      };
      const palProps = {
        item,
        index: 0,
        permToDelete: 'permission',
        fields: {
          value: [{}, item],
        },
        changePermissions: jest.fn(),
      };

      render(<PermissionsAccordionListItem {...palProps} />);
      await userEvent.click(screen.getByRole('button'));

      expect(palProps.changePermissions).toHaveBeenCalledWith([item]);
    });
  });
});
