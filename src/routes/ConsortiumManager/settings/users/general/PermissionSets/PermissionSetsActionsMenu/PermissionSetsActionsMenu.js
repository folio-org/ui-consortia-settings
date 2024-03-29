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
  onCompare,
  disabled,
}) => {
  return (
    <Dropdown
      data-testid="permission-sets-actions-dropdown"
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
              buttonStyle="dropdownItem"
              marginBottom0
              disabled={disabled}
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="stripes-components.addNew" />
              </Icon>
            </Button>
          </PaneMenu>
        </IfPermission>
        <PaneMenu>
          <Button
            id="clickable-compare-permissions"
            onClick={onCompare}
            buttonStyle="dropdownItem"
            marginBottom0
          >
            <Icon size="small" icon="transfer">
              <FormattedMessage id="ui-consortia-settings.consortiumManager.members.action.compare" />
            </Icon>
          </Button>
        </PaneMenu>
      </DropdownMenu>
    </Dropdown>
  );
};

PermissionSetsActionsMenu.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCompare: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
