import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  HasCommand,
  Paneset,
  Pane,
  PaneMenu,
  PaneHeader,
  PaneCloseLink,
  Layer,
  Layout,
} from '@folio/stripes/components';
import { useHistory } from 'react-router-dom';
import { PERMISSION_SET_ROUTES } from '../../../../../../../constants';
import PermissionSetsCompareItem from './PermissionSetsCompareItem';

export const PermissionSetsCompare = () => {
  const history = useHistory();

  const handleCancel = () => {
    history.push('/consortia-settings/users/perms');
  };
  const keyboardCommands = [
    {
      name: 'cancel',
      handler: handleCancel,
      shortcut: 'esc',
    },
  ];

  const firstMenu = (
    <PaneMenu>
      <PaneCloseLink to={PERMISSION_SET_ROUTES.PERMISSION_SETS} />
    </PaneMenu>
  );

  return (
    <HasCommand
      commands={keyboardCommands}
      scope={document.body}
    >
      <Paneset>
        <Layer isOpen container={document.body}>
          <Pane
            defaultWidth="100%"
            onOverflow
            renderHeader={renderProps => (
              <PaneHeader
                firstMenu={firstMenu}
                paneTitle={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare" />}
              />
            )}
            padContent={false}
          >
            <Paneset>
              <Pane
                defaultWidth="50%"
                renderHeader={null}
              >
                <PermissionSetsCompareItem options={[]} name="leftColumn" />
              </Pane>
              <Pane
                defaultWidth="50%"
                renderHeader={null}
              >
                <PermissionSetsCompareItem options={[]} name="leftColumn" />
              </Pane>
            </Paneset>
          </Pane>
        </Layer>
      </Paneset>
    </HasCommand>
  );
};
