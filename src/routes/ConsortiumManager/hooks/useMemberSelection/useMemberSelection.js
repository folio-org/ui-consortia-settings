import { useEffect, useMemo, useState } from 'react';

import { useConsortiumManagerContext } from '../../../../contexts';

export const useMemberSelection = () => {
  const { selectedMembers } = useConsortiumManagerContext();
  const [activeMember, setActiveMember] = useState(selectedMembers[0]?.id);

  useEffect(() => {
    if (!selectedMembers.find(({ id }) => id === activeMember)) {
      setActiveMember(selectedMembers[0]?.id);
    }
  }, [activeMember, selectedMembers]);

  const membersOptions = useMemo(() => {
    return selectedMembers.map(({ id, name }) => ({ value: id, label: name }));
  }, [selectedMembers]);

  return {
    activeMember,
    setActiveMember,
    membersOptions,
  };
};
