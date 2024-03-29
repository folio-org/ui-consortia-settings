import React from 'react';
import PropTypes from 'prop-types';

import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  List,
} from '@folio/stripes/components';
import { getPermissionLabelString } from '@folio/stripes/util';

import PermissionsAccordionListItem from './PermissionsAccordionListItem';

const PermissionsAccordionList = ({ fields, showPerms, getAssignedPermissions, changePermissions, permToDelete }) => {
  const { formatMessage } = useIntl();

  const assignedPermissions = getAssignedPermissions();

  const itemFormatter = (_fieldName, index) => {
    if (fields.value[index]) {
      return (
        <PermissionsAccordionListItem
          key={index}
          item={fields.value[index]}
          index={index}
          fields={fields}
          showPerms={showPerms}
          permToDelete={permToDelete}
          changePermissions={changePermissions}
        />
      );
    }

    return null;
  };

  const sortedItems = (assignedPermissions).sort((a, b) => {
    const permA = getPermissionLabelString(a, formatMessage, showPerms);
    const permB = getPermissionLabelString(b, formatMessage, showPerms);

    return permA.localeCompare(permB);
  });

  return (
    <List
      items={sortedItems}
      itemFormatter={itemFormatter}
      isEmptyMessage={<FormattedMessage id="ui-users.permissions.empty" />}
    />
  );
};

PermissionsAccordionList.propTypes = {
  fields: PropTypes.object,
  showPerms: PropTypes.bool,
  getAssignedPermissions: PropTypes.func,
  changePermissions: PropTypes.func.isRequired,
  permToDelete: PropTypes.string,
};

export default PermissionsAccordionList;
