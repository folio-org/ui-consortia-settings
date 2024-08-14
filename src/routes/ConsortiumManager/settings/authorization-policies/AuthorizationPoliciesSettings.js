import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import AuthorizationPolicies from '@folio/authorization-policies';
import { Selection } from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';

import { useMemberSelection } from '../../hooks';

const AuthorizationPoliciesSettings = (props) => {
  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();

  const AffiliationSelection = useMemo(() => {
    return (
      <Selection
        autoFocus
        dataOptions={membersOptions}
        id="consortium-member-select"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.selection.label" />}
        onChange={setActiveMember}
        value={activeMember}
      />
    );
  }, [activeMember, membersOptions, setActiveMember]);

  return (
    <AuthorizationPolicies
      {...props}
      tenantId={activeMember}
      affiliationSelectionComponent={AffiliationSelection}
    />
  );
};

AuthorizationPoliciesSettings.propTypes = {
  stripes: stripesShape,
};

export default AuthorizationPoliciesSettings;
