import { useMemo, useRef, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';

import { useConsortiumManagerContext } from '../../contexts';
import { FindConsortiumMember } from '../FindConsortiumMember';

import css from './ConsortiumManagerHeader.css';

export const ConsortiumManagerHeader = () => {
  const paneTitleRef = useRef();
  const [selectMembersDisabled, setSelectMembersDisabled] = useState(false);
  const {
    affiliations,
    selectedMembers,
    selectMembers,
    membersObserver,
  } = useConsortiumManagerContext();

  useEffect(() => {
    membersObserver.subscribe(setSelectMembersDisabled);
  }, []);

  console.log(selectMembersDisabled)

  const records = useMemo(() => (
    affiliations.map(({ tenantId, tenantName }) => ({ id: tenantId, name: tenantName }))
  ), [affiliations]);

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
