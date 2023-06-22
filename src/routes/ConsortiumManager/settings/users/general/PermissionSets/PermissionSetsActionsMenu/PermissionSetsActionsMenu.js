import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  PaneMenu,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

export const PermissionSetsActionsMenu = ({
  onCreate,
}) => {
  return (
    <Dropdown
      label={<FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />}
      buttonProps={{
        buttonStyle: 'primary',
        marginBottom0: true,
      }}
      modifiers={{
        preventOverflow: { boundariesElement: 'scrollParent' },
      }}
    >
      <DropdownMenu>
        <IfPermission perm="perms.permissions.item.post">
          <PaneMenu>
            <Button
              id="clickable-create-entry"
              onClick={onCreate}
              // TODO: UICONSET-59
              disabled
              // ^^^^^^^^^^^^^^^^^
              buttonStyle="dropdownItem"
              marginBottom0
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="stripes-components.addNew" />
              </Icon>
            </Button>
          </PaneMenu>
        </IfPermission>
      </DropdownMenu>
    </Dropdown>
  );
};

PermissionSetsActionsMenu.propTypes = {
  onCreate: PropTypes.func.isRequired,
};
