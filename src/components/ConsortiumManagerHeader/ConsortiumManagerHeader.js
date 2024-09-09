import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';

import { EVENT_EMITTER_EVENTS } from '../../constants';
import { useConsortiumManagerContext } from '../../contexts';
import { useEventEmitter } from '../../hooks';
import { ConsortiumManagerNavigationPaneToggle } from '../ConsortiumManagerNavigationPaneToggle';
import { FindConsortiumMember } from '../FindConsortiumMember';

import css from './ConsortiumManagerHeader.css';

export const ConsortiumManagerHeader = () => {
  const paneTitleRef = useRef();
  const eventEmitter = useEventEmitter();
  const [selectMembersDisabled, setSelectMembersDisabled] = useState();
  const {
    affiliations,
    isNavigationPaneVisible,
    selectedMembers,
    selectMembers,
  } = useConsortiumManagerContext();

  useEffect(() => {
    const eventType = EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS;
    const callback = ({ detail }) => setSelectMembersDisabled(detail);

    eventEmitter.on(eventType, callback);

    return () => {
      eventEmitter.off(eventType, callback);
    };
  }, [eventEmitter]);

  const records = useMemo(() => (
    affiliations.map(({ tenantId, tenantName }) => ({ id: tenantId, name: tenantName }))
  ), [affiliations]);

  const firstMenu = useMemo(() => {
    if (selectMembersDisabled || isNavigationPaneVisible) return null;

    return <ConsortiumManagerNavigationPaneToggle />;
  }, [isNavigationPaneVisible, selectMembersDisabled]);

  return (
    <Paneset nested>
      <PaneHeader
        id="consortium-manager-header"
        className={css.managerHeader}
        paneTitleRef={paneTitleRef}
        paneTitle={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.header.title" />}
        paneSub={Boolean(selectedMembers) && (
          <FormattedMessage
            id="ui-consortia-settings.consortiumManager.members.header.subTitle"
            values={{ amount: selectedMembers.length }}
          />
        )}
        firstMenu={firstMenu}
        lastMenu={(
          <FindConsortiumMember
            disabled={selectMembersDisabled}
            records={records}
            initialSelected={selectedMembers}
            selectRecords={selectMembers}
          />
        )}
      />
    </Paneset>
  );
};
