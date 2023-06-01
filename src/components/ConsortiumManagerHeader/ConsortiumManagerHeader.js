import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import { useConsortiumManagerContext } from '../../contexts';
import { FindConsortiumMember } from '../FindConsortiumMember';

export const ConsortiumManagerHeader = () => {
  const {
    affiliations,
    selectedMembers,
    selectMembers,
    selectMembersDisabled,
  } = useConsortiumManagerContext();

  const records = useMemo(() => (
    affiliations.map(({ tenantId, tenantName }) => ({ id: tenantId, name: tenantName }))
  ), [affiliations]);

  return (
    <Paneset isRoot static>
      <Pane
        defaultWidth="fill"
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
        padContent={false}
      />
    </Paneset>
  );
};
