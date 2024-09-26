import { MemberSelectionContextProvider } from '../../MemberSelectionContext';
import { AuthorizationPoliciesSettings } from './AuthorizationPoliciesSettings';

const AuthorizationPoliciesSettingsContainer = () => {
  return (
    <MemberSelectionContextProvider>
      <AuthorizationPoliciesSettings />
    </MemberSelectionContextProvider>
  );
};

export default AuthorizationPoliciesSettingsContainer;
