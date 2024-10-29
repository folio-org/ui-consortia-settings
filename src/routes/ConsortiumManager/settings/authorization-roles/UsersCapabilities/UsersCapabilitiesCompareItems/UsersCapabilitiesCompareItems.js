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

import { useShowCallout } from '@folio/stripes-acq-components';
import {
  Accordion,
  AccordionSet,
  EmptyMessage,
  Selection,
} from '@folio/stripes/components';
import {
  CapabilitiesSection,
  useAuthorizationRoles,
  useRoleCapabilities,
  useRoleCapabilitySets,
  useUserCapabilities,
  useUserCapabilitiesSets,
  useUserRolesById,
} from '@folio/stripes-authorization-components';

import { handleErrorMessages } from '../../../../../../utils';
import { useUsers } from '../../../../../../hooks';
import { mergeAndGetUniqueById, onFilter } from '../../utils';

export const UsersCapabilitiesCompareItems = ({
  columnName,
  members,
  rolesToCompare,
  setRolesToCompare,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState({
    capabilities: false,
    capabilitiesSets: false,
  });
  const isMounted = useRef(false);

  const { users, isFetching } = useUsers({ tenant: selectedMemberId }, {
    onError: ({ response }) => handleErrorMessages({
      intl,
      showCallout,
      response,
      messageId: 'ui-consortia-settings.authorizationRoles.errors.loading.users',
    }),
  });
  const { userRolesResponse } = useUserRolesById(selectedUserId, { tenantId: selectedMemberId });
  const { roles, isLoading } = useAuthorizationRoles(selectedMemberId, {
    onError: ({ response }) => handleErrorMessages({
      intl,
      showCallout,
      response,
      messageId: 'ui-consortia-settings.authorizationRoles.errors.loading.roles',
    }),
    enabled: Boolean(selectedUserId),
  });

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
  } = useUserCapabilities(selectedUserId, selectedMemberId, true);

  const {
    groupedUserCapabilitySetsByType,
    capabilitySetsTotalCount,
    isSuccess: isSuccessCapabilitiesSet,
    initialUserCapabilitySetsSelectedMap,
  } = useUserCapabilitiesSets(selectedUserId, selectedMemberId);

  const {
    groupedRoleCapabilitySetsByType,
    capabilitySetsTotalCount: setsByRoleTotalCount,
    isSuccess: isSuccessRoleCapabilitiesSet,
  } = useRoleCapabilitySets(selectedRoleId, selectedMemberId);

  const {
    capabilitiesTotalCount: capabilitiesByRoleCountTotal,
    groupedRoleCapabilitiesByType,
    isSuccess: isSuccessRoleCapabilities,
  } = useRoleCapabilities(selectedRoleId, selectedMemberId, true);

  useEffect(() => {
    if (isMounted.current &&
      (isSuccessCapabilitiesSet || isSuccessRoleCapabilitiesSet)
      && (isSuccessCapabilities || isSuccessRoleCapabilities)) {
      setRolesToCompare({
        capabilities: mergeAndGetUniqueById(groupedUserCapabilitiesByType, groupedRoleCapabilitiesByType),
        capabilitiesSets: mergeAndGetUniqueById(groupedUserCapabilitySetsByType, groupedRoleCapabilitySetsByType),
      }, columnName);
    } else {
      isMounted.current = true;
    }
    // adding `setRolesToCompare` as dependency will cause to infinite update loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedRoleId,
    columnName,
    capabilitiesTotalCount,
    capabilitiesByRoleCountTotal,
    setsByRoleTotalCount,
    isSuccessRoleCapabilitiesSet,
    isSuccessRoleCapabilities,
    isSuccessCapabilities,
    isSuccessCapabilitiesSet,
  ]);

  const handleUserChange = (value) => {
    setSelectedUserId(value);
    setSelectedRoleId('');

    setIsAccordionOpen({
      capabilities: true,
      capabilitiesSets: true,
    });

    setRolesToCompare({
      capabilities: [],
      capabilitiesSets: [],
    }, columnName);
  };

  const handleMemberChange = (value) => {
    setSelectedUserId('');
    setSelectedRoleId('');
    setSelectedMemberId(value);

    setRolesToCompare({
      capabilities: [],
      capabilitiesSets: [],
    }, columnName);
  };

  const isCapabilitySelected = (capabilityId) => !!initialUserCapabilitiesSelectedMap[capabilityId];
  const isCapabilitySetSelected = (capabilitySetId) => !!initialUserCapabilitySetsSelectedMap[capabilitySetId];

  return (
    <div>
      <Selection
        name="members"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.member" />}
        id="memberSelect"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.compare.member.placeholder' })}
        dataOptions={members}
        onChange={handleMemberChange}
        onFilter={onFilter}
      />
      <Selection
        name="users"
        onChange={handleUserChange}
        dataOptions={availableUsers}
        loading={isFetching}
        value={selectedUserId}
        disabled={!selectedMemberId}
        onFilter={onFilter}
        placeholder={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.user.placeholder" />}
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.user" />}
      />
      <Selection
        name="authorization-role"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare.roles" />}
        id="permissionSet"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare.placeholder' })}
        dataOptions={availableRoles}
        disabled={!selectedUserId}
        value={selectedRoleId}
        onChange={setSelectedRoleId}
        loading={isLoading}
        onFilter={onFilter}
      />
      <AccordionSet>
        <Accordion
          closedByDefault
          open={isAccordionOpen.capabilities}
          onToggle={() => setIsAccordionOpen(prevState => ({
            ...prevState,
            capabilities: !prevState.capabilities,
          }))}
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.capabilities" />}
        >
          {capabilitiesTotalCount || capabilitiesByRoleCountTotal ?
            <CapabilitiesSection
              isCapabilitySelected={isCapabilitySelected}
              capabilities={mergeAndGetUniqueById(groupedUserCapabilitiesByType, groupedRoleCapabilitiesByType)}
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
        <Accordion
          closedByDefault
          open={isAccordionOpen.capabilitiesSets}
          onToggle={() => setIsAccordionOpen(prevState => ({
            ...prevState,
            capabilitiesSets: !prevState.capabilitiesSets,
          }))}
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.roles.capabilitiesSets" />}
        >
          {capabilitySetsTotalCount || setsByRoleTotalCount ?
            <CapabilitiesSection
              isCapabilitySelected={isCapabilitySetSelected}
              readOnly
              capabilities={mergeAndGetUniqueById(groupedUserCapabilitySetsByType, groupedRoleCapabilitySetsByType)}
              capabilitiesToCompare={rolesToCompare.capabilitiesSets}
              isNeedToCompare
            />
            :
            <EmptyMessage>
              <FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.capabilitiesSets.empty" />
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
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
