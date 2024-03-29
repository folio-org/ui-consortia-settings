import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { orderBy } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { getPermissionLabelString } from '@folio/stripes/util';

import PermissionLabel from '../../../PermissionLabel';
import CheckboxColumn from '../CheckboxColumn';

const SORT_DIRECTIONS = {
  asc: {
    name: 'asc',
    fullName: 'ascending',
  },
  desc: {
    name: 'desc',
    fullName: 'descending',
  },
};

const PermissionsList = (props) => {
  const {
    assignedPermissionIds,
    filteredPermissions,
    intl: { formatMessage },
    setAssignedPermissionIds,
    togglePermission,
    visibleColumns,
  } = props;

  const [sortedColumn, setSortedColumn] = useState('permissionName');
  const [sortOrder, setSortOrder] = useState(SORT_DIRECTIONS.asc.name);

  const rowUpdater = ({ id }) => assignedPermissionIds.includes(id);

  const sorters = {
    permissionName: permission => getPermissionLabelString(permission, formatMessage)?.toLowerCase(),
    status: ({ id, permissionName }) => [assignedPermissionIds.includes(id), permissionName],
    type: ({ mutable, permissionName }) => [!mutable, permissionName],
  };

  const sortedPermissions = orderBy(filteredPermissions, sorters[sortedColumn], sortOrder);
  const allChecked = sortedPermissions.every(({ id }) => assignedPermissionIds.includes(id));

  const toggleAllPermissions = useCallback(({ target: { checked } }) => {
    let result = [...assignedPermissionIds];

    if (checked) {
      sortedPermissions.forEach(({ id }) => {
        if (!result.includes(id)) {
          result.push(id);
        }
      });
    } else {
      result = assignedPermissionIds.filter((assignedPermissionId) => !sortedPermissions.find(
        ({ id: sortedPermissionId }) => sortedPermissionId === assignedPermissionId,
      ));
    }

    setAssignedPermissionIds(result);
  }, [assignedPermissionIds, setAssignedPermissionIds, sortedPermissions]);

  const onHeaderClick = (e, { name: columnName }) => {
    if (sortedColumn !== columnName) {
      setSortedColumn(columnName);
      setSortOrder(SORT_DIRECTIONS.desc.name);
    } else {
      const newSortOrder = (sortOrder === SORT_DIRECTIONS.desc.name)
        ? SORT_DIRECTIONS.asc.name
        : SORT_DIRECTIONS.desc.name;

      setSortOrder(newSortOrder);
    }
  };

  const columnMapping = useMemo(() => ({
    selected: (
      <div data-test-select-all-permissions>
        <CheckboxColumn
          permissionName="select-all"
          value="selectAll"
          checked={allChecked}
          onChange={toggleAllPermissions}
        />
      </div>
    ),
    permissionName: <FormattedMessage id="ui-users.information.name" />,
    status: <FormattedMessage id="ui-users.information.status" />,
    type: <FormattedMessage id="ui-users.permissions.modal.type" />,
  }), [allChecked, toggleAllPermissions]);

  const formatter = useMemo(() => ({
    selected: permission => (
      <CheckboxColumn
        permissionName={permission.permissionName}
        value={permission.id}
        // eslint-disable-next-line react/prop-types
        checked={assignedPermissionIds.includes(permission.id)}
        onChange={() => togglePermission(permission.id)}
      />
    ),
    // eslint-disable-next-line react/prop-types
    permissionName: permission => (
      <div data-test-permission-name>
        <PermissionLabel permission={permission} />
      </div>
    ),
    status: permission => {
      const statusText = `ui-users.permissions.modal.${
        // eslint-disable-next-line react/prop-types
        assignedPermissionIds.includes(permission.id)
          ? 'assigned'
          : 'unassigned'
      }`;

      return <div data-test-permission-status><FormattedMessage id={statusText} /></div>;
    },
    // eslint-disable-next-line react/prop-types
    type: ({ mutable }) => {
      const typeText = `ui-users.permissions.modal.${
        !mutable
          ? 'permission'
          : 'permissionSet'
      }`;

      return <div data-test-permission-type><FormattedMessage id={typeText} /></div>;
    },
  }), [assignedPermissionIds, togglePermission]);

  return (
    <div data-test-permissions-list>
      <MultiColumnList
        id="list-permissions"
        columnWidths={{
          selected: '35px',
        }}
        rowUpdater={rowUpdater}
        visibleColumns={visibleColumns}
        contentData={sortedPermissions}
        columnMapping={columnMapping}
        formatter={formatter}
        onRowClick={(e, { id: permissionId }) => togglePermission(permissionId)}
        onHeaderClick={onHeaderClick}
        sortDirection={SORT_DIRECTIONS[sortOrder].fullName}
        sortedColumn={sortedColumn}
      />
    </div>
  );
};

PermissionsList.propTypes = {
  assignedPermissionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  filteredPermissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string,
      permissionName: PropTypes.string.isRequired,
      subPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
      dummy: PropTypes.bool.isRequired,
      mutable: PropTypes.bool.isRequired,
      visible: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  setAssignedPermissionIds: PropTypes.func.isRequired,
  togglePermission: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectIntl(PermissionsList);
