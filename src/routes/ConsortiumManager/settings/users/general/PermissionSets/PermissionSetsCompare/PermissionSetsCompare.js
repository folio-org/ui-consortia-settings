import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  HasCommand,
  Paneset,
  Pane,
  PaneMenu,
  PaneHeader,
  PaneCloseLink,
  Layer,
} from '@folio/stripes/components';
import { useHistory } from 'react-router-dom';
import { PERMISSION_SET_ROUTES } from '../../../../../../../constants';
import PermissionSetsCompareItem from './PermissionSetsCompareItem';
import { useConsortiumManagerContext } from '../../../../../../../contexts/ConsortiumManagerContext';
import { COMPARE_ITEM_NAME } from './constants';

export const PermissionSetsCompare = () => {
  const history = useHistory();
  const { selectedMembers } = useConsortiumManagerContext();

  const [permissionsToCompare, setPermissionsToCompare] = useState({
    [COMPARE_ITEM_NAME.LEFT_COLUMN]: [],
    [COMPARE_ITEM_NAME.RIGHT_COLUMN]: [],
  });
  const members = useMemo(() => selectedMembers.map(({ id, name }) => ({ value: id, label: name })), [selectedMembers]);

  const handleCancel = () => {
    history.push('/consortia-settings/users/perms');
  };

  const handlePermissionsToCompare = useCallback((permissions, columnName) => {
    setPermissionsToCompare({
      ...permissionsToCompare,
      [columnName]: permissions,
    });
  }, [permissionsToCompare]);

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
        <Layer isOpen>
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
                <PermissionSetsCompareItem
                  selectedMemberOptions={members}
                  columnName={COMPARE_ITEM_NAME.LEFT_COLUMN}
                  setPermissionsToCompare={handlePermissionsToCompare}
                  permissionsToCompare={permissionsToCompare[COMPARE_ITEM_NAME.RIGHT_COLUMN]}
                />
              </Pane>
              <Pane
                defaultWidth="50%"
                renderHeader={null}
              >
                <PermissionSetsCompareItem
                  selectedMemberOptions={members}
                  columnName={COMPARE_ITEM_NAME.RIGHT_COLUMN}
                  setPermissionsToCompare={handlePermissionsToCompare}
                  permissionsToCompare={permissionsToCompare[COMPARE_ITEM_NAME.LEFT_COLUMN]}
                />
              </Pane>
            </Paneset>
          </Pane>
        </Layer>
      </Paneset>
    </HasCommand>
  );
};
