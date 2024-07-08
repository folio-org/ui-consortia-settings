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
import PropTypes, { object } from 'prop-types';

import {
  Accordion,
  AccordionSet,
  Selection,
  EmptyMessage,
} from '@folio/stripes/components';

import {
  CapabilitiesSection,
  useRoleCapabilities,
  useRoleCapabilitySets,
} from '@folio/stripes-authorization-components';

import {
  useAuthorizationRoles,
} from '../../../../../../hooks';

export const CapabilitiesCompareItem = ({
  columnName,
  members,
  rolesToCompare,
  setRolesToCompare,
  initialSelectedMemberId,
}) => {
  const intl = useIntl();
  const [selectedRoleId, setSelectedRoleId] = useState(initialSelectedMemberId);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const isMounted = useRef(false);

  const { roles, isLoading } = useAuthorizationRoles(selectedMemberId);

  const availableRoles = useMemo(() => {
    return roles.map((el) => {
      return ({
        value: el.id,
        label: el.name,
      });
    });
  }, [roles, selectedMemberId]);

  const {
    groupedRoleCapabilitySetsByType,
    capabilitySetsTotalCount,
    isSuccess: isSuccessCapabilitiesSet,
    initialRoleCapabilitySetsSelectedMap,
  } = useRoleCapabilitySets(selectedRoleId, selectedMemberId);

  const {
    capabilitiesTotalCount,
    isSuccess: isSuccessCapabilities,
    initialRoleCapabilitiesSelectedMap,
    groupedRoleCapabilitiesByType,
  } = useRoleCapabilities(selectedRoleId, selectedMemberId);

  useEffect(() => {
    if (isMounted.current && isSuccessCapabilitiesSet && isSuccessCapabilities) {
      setRolesToCompare({
        capabilities: groupedRoleCapabilitiesByType,
        capabilitiesSets: groupedRoleCapabilitySetsByType,
      }, columnName);
    } else {
      isMounted.current = true;
    }
    // adding `setRolesToCompare` as dependency will cause to infinite update loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId, columnName, capabilitiesTotalCount, capabilitySetsTotalCount]);

  const isCapabilitySetSelected = (capabilitySetId) => !!initialRoleCapabilitySetsSelectedMap[capabilitySetId];
  const isCapabilitySelected = (capabilityId) => !!initialRoleCapabilitiesSelectedMap[capabilityId];

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
              capabilities={groupedRoleCapabilitiesByType}
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
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.capabilitiesSets" /> }
        >
          {capabilitySetsTotalCount ?
            <CapabilitiesSection
              isCapabilitySelected={isCapabilitySetSelected}
              readOnly
              capabilities={groupedRoleCapabilitySetsByType}
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

CapabilitiesCompareItem.propTypes = {
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
