import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import xor from 'lodash/xor';
import PropTypes from 'prop-types';

import {
  Selection,
  AccordionSet,
  Accordion,
  List,
} from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useTenantPermissions } from '../../../../../../../hooks';
import ItemFormatter from './ItemFormatter';

export function PermissionSetsCompareItem({
  columnName,
  permissionsToCompare,
  selectedMemberOptions,
  setPermissionsToCompare,
  initialSelectedMemberId,
}) {
  const intl = useIntl();
  const isMounted = useRef(false);
  const [selectedMemberId, setSelectedMemberId] = useState(initialSelectedMemberId);
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const showCallout = useShowCallout();

  const handlePermissionsLoadingError = useCallback(({ response }) => {
    const defaultMessage = intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionSets.load.common' });

    if (response?.status === 403) {
      return showCallout({
        message: `${defaultMessage} ${intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionsRequired' })}`,
        type: 'error',
      });
    }

    return showCallout({
      message: defaultMessage,
      type: 'error',
    });
  }, [intl, showCallout]);

  const {
    isFetching,
    permissions,
  } = useTenantPermissions(
    {
      tenantId: selectedMemberId,
      searchParams: {
        query: 'mutable==true',
        expandSubs: true,
      },
    },
    { onError: handlePermissionsLoadingError },
  );

  const permissionOptions = useMemo(() => {
    return permissions.map(({ id, displayName }) => ({ value: id, label: displayName }));
  }, [permissions]);

  const assignedPermissionsList = useMemo(() => {
    const selectedPermission = permissions.find(({ id }) => id === selectedPermissionId);

    return selectedPermission?.subPermissions?.map(({ displayName }) => displayName) || [];
  }, [selectedPermissionId, permissions]);

  const uniqueItems = xor(assignedPermissionsList, permissionsToCompare);
  const itemFormatter = (item) => <ItemFormatter item={item} uniqueItems={uniqueItems} />;
  const isEmptyMessage = <FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.permissionSet.empty" />;

  useEffect(() => {
    if (isMounted.current) {
      setPermissionsToCompare(assignedPermissionsList, columnName);
    } else {
      isMounted.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // adding `setPermissionsToCompare` as dependency will cause to infinite update loop
  }, [assignedPermissionsList, columnName]);

  return (
    <div>
      <Selection
        name="members"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.member" />}
        id="memberSelect"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.compare.member.placeholder' })}
        dataOptions={selectedMemberOptions}
        onChange={setSelectedMemberId}
        value={selectedMemberId}
      />
      <Selection
        name="permission-set"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.permissionSet" />}
        id="permissionSet"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.compare.permissionSet.placeholder' })}
        dataOptions={permissionOptions}
        onChange={setSelectedPermissionId}
        loading={isFetching}
        disabled={!selectedMemberId}
      />
      <AccordionSet>
        <Accordion
          id="assigned-permissions"
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.assignedPermissions" />}
        >
          <List
            items={assignedPermissionsList}
            itemFormatter={itemFormatter}
            isEmptyMessage={isEmptyMessage}
          />
        </Accordion>
      </AccordionSet>
    </div>
  );
}

PermissionSetsCompareItem.propTypes = {
  permissionsToCompare: PropTypes.arrayOf(PropTypes.string),
  setPermissionsToCompare: PropTypes.func,
  columnName: PropTypes.string.isRequired,
  initialSelectedMemberId: PropTypes.string,
  selectedMemberOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};

PermissionSetsCompareItem.defaultProps = {
  selectedMemberOptions: [],
  permissionsToCompare: [],
  initialSelectedMemberId: '',
};
