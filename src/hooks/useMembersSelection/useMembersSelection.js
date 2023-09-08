import {
  useCallback,
} from 'react';
import {
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';

import {
  useNamespace,
} from '@folio/stripes/core';

export const STORAGE_POSTFIX = 'selected_members';

export const useMembersSelection = () => {
  const [namespace] = useNamespace();
  const storageKey = `${namespace}/${STORAGE_POSTFIX}`;

  const [members] = useLocalStorage(storageKey);

  const updateMembersSelection = useCallback((newMembers = []) => {
    writeStorage(storageKey, newMembers);
  }, [storageKey]);

  const initMembersSelection = useCallback((userAffiliations) => {
    let initMembers = userAffiliations.map(({ tenantId, tenantName }) => ({ id: tenantId, name: tenantName }));

    if (members) {
      initMembers = initMembers.filter(iMember => members.find(member => member.id === iMember.id));
    }

    updateMembersSelection(initMembers);
  }, [members, updateMembersSelection]);

  return {
    members,
    initMembersSelection,
    updateMembersSelection,
  };
};
