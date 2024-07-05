import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import {
  Layer,
  Pane,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';

import { CapabilitiesCompareItem } from './CabalitiesCompareItem';
import { useConsortiumManagerContext } from '../../../../../../contexts';
import { COMPARE_ITEM_NAME } from '../../../users/general/PermissionSets/PermissionSetsCompare/constants';
import { TENANT_ID_SEARCH_PARAMS } from '../../../users/general/PermissionSets/constants';

export const CapabilitiesCompare = () => {
  const { search } = useLocation();
  const intl = useIntl();
  const initialSelectedMemberId = useMemo(() => new URLSearchParams(search).get(TENANT_ID_SEARCH_PARAMS), [search]);
  const [rolesToCompare, setRolesToCompare] = useState({
    [COMPARE_ITEM_NAME.LEFT_COLUMN]: [],
    [COMPARE_ITEM_NAME.RIGHT_COLUMN]: [],
  });

  const { selectedMembers } = useConsortiumManagerContext();

  const members = useMemo(() => {
    return selectedMembers.map(({ id, name }) => ({ value: id, label: name }));
  }, [selectedMembers]);

  const handleRolesToCompare = useCallback((roles, columnName) => {
    setRolesToCompare({
      ...rolesToCompare,
      [columnName]: {
        capabilities: roles.capabilities,
        capabilitiesSets: roles.capabilitiesSets,
      },
    });
  }, [rolesToCompare]);

  return (
    <Layer
      isOpen
      inRootSet
      contentLabel={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare' })}
    >
      <Pane
        defaultWidth="100%"
        noOverflow
        renderHeader={() => (
          <PaneHeader
            paneTitle={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare" />}
          />
        )}
        padContent={false}
      >
        <Paneset>
          <Pane
            defaultWidth="50%"
            renderHeader={null}
          >
            <CapabilitiesCompareItem
              members={members}
              columnName={COMPARE_ITEM_NAME.LEFT_COLUMN}
              rolesToCompare={rolesToCompare[COMPARE_ITEM_NAME.RIGHT_COLUMN]}
              setRolesToCompare={handleRolesToCompare}
              initialSelectedMemberId={initialSelectedMemberId}
            />
          </Pane>
          <Pane
            defaultWidth="50%"
            renderHeader={null}
          >
            <CapabilitiesCompareItem
              members={members}
              columnName={COMPARE_ITEM_NAME.RIGHT_COLUMN}
              rolesToCompare={rolesToCompare[COMPARE_ITEM_NAME.LEFT_COLUMN]}
              setRolesToCompare={handleRolesToCompare}
            />
          </Pane>
        </Paneset>
      </Pane>
    </Layer>
  );
};
