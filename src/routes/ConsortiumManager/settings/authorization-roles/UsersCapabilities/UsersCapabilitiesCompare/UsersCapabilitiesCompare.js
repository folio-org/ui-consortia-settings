import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';

import {
  Layer,
  Pane,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';

import { AUTHORIZATION_ROLES_ROUTE } from '../../../../../../constants';
import { useConsortiumManagerContext } from '../../../../../../contexts';
import { TENANT_ID_SEARCH_PARAMS } from '../../../users/general/PermissionSets/constants';
import { COMPARE_ITEM_NAME } from '../../../users/general/PermissionSets/PermissionSetsCompare/constants';
import { UsersCapabilitiesCompareItems } from '../UsersCapabilitiesCompareItems';

export const UsersCapabilitiesCompare = () => {
  const history = useHistory();
  const { search } = useLocation();
  const intl = useIntl();

  const initialSelectedMemberId = useMemo(() => new URLSearchParams(search).get(TENANT_ID_SEARCH_PARAMS), [search]);
  const [rolesToCompare, setRolesToCompare] = useState({
    [COMPARE_ITEM_NAME.LEFT_COLUMN]: [],
    [COMPARE_ITEM_NAME.RIGHT_COLUMN]: [],
  });

  const { selectedMembers } = useConsortiumManagerContext();

  const handleRolesToCompare = useCallback((roles, columnName) => {
    setRolesToCompare({
      ...rolesToCompare,
      [columnName]: {
        capabilities: roles.capabilities,
        capabilitiesSets: roles.capabilitiesSets,
      },
    });
  }, [rolesToCompare]);

  const members = useMemo(() => {
    return selectedMembers.map(({ id, name }) => ({ value: id, label: name }));
  }, [selectedMembers]);

  const onClose = () => history.push(AUTHORIZATION_ROLES_ROUTE);

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
            dismissible
            onClose={onClose}
            paneTitle={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.users.compare" />}
          />
        )}
        padContent={false}
      >
        <Paneset>
          <Pane
            defaultWidth="50%"
            renderHeader={null}
          >
            <UsersCapabilitiesCompareItems
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
            <UsersCapabilitiesCompareItems
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
