import PropTypes, { object } from 'prop-types';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Selection,
  EmptyMessage,
} from '@folio/stripes/components';
import {
  CapabilitiesSection,
  useAuthorizationRoles,
  useUserCapabilities,
  useUserRolesByUserIds,
} from '@folio/stripes-authorization-components';
import { useUsers } from '../../../../../../hooks';


export const UsersCapabilitiesCompareItems = ({
  columnName,
  members,
  rolesToCompare,
  setRolesToCompare,
  initialSelectedMemberId,
}) => {
  const intl = useIntl();
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(initialSelectedMemberId);
  const [selectedUserId, setSelectedUserId] = useState('');
  const isMounted = useRef(false);

  const { users, isFetching } = useUsers({ tenant: selectedMemberId });
  const { userRolesResponse } = useUserRolesByUserIds([selectedUserId]);
  const { roles, isLoading } = useAuthorizationRoles(selectedMemberId);

  const availableRoles = useMemo(() => {
    return roles.filter(role => userRolesResponse.some(userRole => userRole.roleId === role.id)).map((el) => {
      return ({
        value: el.id,
        label: el.name,
      });
    });
  }, [roles, userRolesResponse]);

  const availableUsers = useMemo(() => {
    return users.map((el) => {
      return ({
        value: el.id,
        label: el.username,
      });
    });
  }, [users]);

  const {
    capabilitiesTotalCount,
    isSuccess: isSuccessCapabilities,
    initialUserCapabilitiesSelectedMap,
    groupedUserCapabilitiesByType,
  } = useUserCapabilities(selectedUserId, selectedMemberId, selectedRoleId);

  useEffect(() => {
    if (isMounted.current && isSuccessCapabilities) {
      setRolesToCompare({
        capabilities: groupedUserCapabilitiesByType,
      }, columnName);
    } else {
      isMounted.current = true;
    }
    // adding `setRolesToCompare` as dependency will cause to infinite update loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId, columnName, capabilitiesTotalCount]);

  const handleUserChange = (value) => {
    setSelectedUserId(value);
    setSelectedRoleId('');
  };

  const isCapabilitySelected = (capabilityId) => !!initialUserCapabilitiesSelectedMap[capabilityId];

  return (
    <div>
      <Selection
        name="members"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.member" />}
        id="memberSelect"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.compare.member.placeholder' })}
        dataOptions={members}
        onChange={setSelectedMemberId}
      />
      <Selection
        name="users"
        onChange={handleUserChange}
        dataOptions={availableUsers}
        loading={isFetching}
        value={selectedUserId}
        placeholder={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.user.placeholder" />}
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.user" />}
      />
      <Selection
        name="authorization-role"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare.roles" />}
        id="permissionSet"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare.placeholder' })}
        dataOptions={availableRoles}
        value={selectedRoleId}
        onChange={setSelectedRoleId}
        loading={isLoading}
      />
      <AccordionSet>
        <Accordion
          closedByDefault
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.capabilities" />}
        >
          {capabilitiesTotalCount ?
            <CapabilitiesSection
              isCapabilitySelected={isCapabilitySelected}
              capabilities={groupedUserCapabilitiesByType}
              readOnly
              capabilitiesToCompare={rolesToCompare.capabilities}
              isNeedToCompare
            />
            :
            <EmptyMessage>
              <FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.capabilities.empty" />
            </EmptyMessage>
          }
        </Accordion>
      </AccordionSet>
    </div>
  );
};

UsersCapabilitiesCompareItems.propTypes = {
  rolesToCompare: PropTypes.arrayOf(PropTypes.shape(
    {
      capabilities: PropTypes.arrayOf(object),
      capabilitiesSets: PropTypes.arrayOf(object),
    },
  )),
  setRolesToCompare: PropTypes.func,
  columnName: PropTypes.string.isRequired,
  initialSelectedMemberId: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
