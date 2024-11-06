import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pluggable,
  withStripes,
} from '@folio/stripes/core';

import styles from './AssignUsers.css';

const buttonLabel = <FormattedMessage id="ui-users.permissions.assignUsers.actions.assign" />;

const AssignUsers = ({ assignUsers, stripes, selectedUsers, tenantId }) => {
  const initialSelectedUsers = useMemo(() => keyBy(selectedUsers, 'id'), [selectedUsers]);
  const tenantName = useMemo(() => {
    const foundTenant = stripes.user?.user?.tenants?.find(tenant => tenant.id === tenantId);

    return foundTenant?.name || tenantId;
  }, [stripes.user?.user?.tenants, tenantId]);

  return (
    <div className={styles.AssignUsersWrapper}>
      <Pluggable
        aria-haspopup="true"
        dataKey="assignUsers"
        searchButtonStyle="default"
        searchLabel={buttonLabel}
        stripes={stripes}
        type="find-user"
        selectUsers={assignUsers}
        initialSelectedUsers={initialSelectedUsers}
        tenantId={tenantId}
        modalTitle={(
          <FormattedMessage
            id="ui-consortia-settings.consortiumManager.members.users.selectUser.modal.label"
            values={{ tenant: tenantName }}
          />
      )}
      >
        <FormattedMessage id="ui-users.permissions.assignUsers.actions.assign.notAvailable" />
      </Pluggable>
    </div>
  );
};

AssignUsers.propTypes = {
  assignUsers: PropTypes.func.isRequired,
  stripes: PropTypes.object.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.object),
  tenantId: PropTypes.string,
};

export default withStripes(AssignUsers);
