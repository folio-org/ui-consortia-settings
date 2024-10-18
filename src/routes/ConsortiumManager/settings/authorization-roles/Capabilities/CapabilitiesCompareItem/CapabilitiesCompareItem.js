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
  Selection,
  EmptyMessage,
} from '@folio/stripes/components';
import {
  CapabilitiesSection,
  useAuthorizationRoles,
  useRoleCapabilities,
  useRoleCapabilitySets,
} from '@folio/stripes-authorization-components';

import { handleErrorMessages } from '../../../../../../utils';
import { onFilter } from '../../utils';

export const CapabilitiesCompareItem = ({
  columnName,
  members,
  rolesToCompare,
  setRolesToCompare,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const isMounted = useRef(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState({
    capabilities: false,
    capabilitiesSets: false,
  });

  const { roles, isLoading } = useAuthorizationRoles(selectedMemberId, {
    onError: ({ response }) => handleErrorMessages({
      intl,
      showCallout,
      response,
      messageId: 'ui-consortia-settings.authorizationRoles.errors.loading.roles',
    }),
  });

  const availableRoles = useMemo(() => {
    return roles.map((el) => {
      return ({
        value: el.id,
        label: el.name,
      });
    });
  }, [roles]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedRoleId,
    columnName,
    groupedRoleCapabilitiesByType,
    capabilitySetsTotalCount,
    selectedMemberId,
    isSuccessCapabilitiesSet,
    isSuccessCapabilities,
    groupedRoleCapabilitySetsByType,
  ]);

  const isCapabilitySetSelected = (capabilitySetId) => !!initialRoleCapabilitySetsSelectedMap[capabilitySetId];
  const isCapabilitySelected = (capabilityId) => !!initialRoleCapabilitiesSelectedMap[capabilityId];
  const handleMemberChange = (value) => {
    setSelectedMemberId(value);
    setSelectedRoleId('');

    setRolesToCompare({
      capabilities: [],
      capabilitiesSets: [],
    }, columnName);
  };
  const handleRoleChange = (value) => {
    setSelectedRoleId(value);

    setIsAccordionOpen({
      capabilities: true,
      capabilitiesSets: true,
    });
  };

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
        name="authorization-role"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare.roles" />}
        id="permissionSet"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare.placeholder' })}
        dataOptions={availableRoles}
        value={selectedRoleId}
        disabled={!selectedMemberId}
        onChange={handleRoleChange}
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
          open={isAccordionOpen.capabilitiesSets}
          onToggle={() => setIsAccordionOpen(prevState => ({
            ...prevState,
            capabilitiesSets: !prevState.capabilitiesSets,
          }))}
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.roles.capabilitiesSets" />}
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
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
