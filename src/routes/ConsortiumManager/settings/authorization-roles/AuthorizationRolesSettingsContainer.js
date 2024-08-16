import { MemberSelectionContextProvider } from '../../MemberSelectionContext';
import { AuthorizationRolesSettings } from './AuthorizationRolesSettings';

const AuthorizationRolesSettingsContainer = () => {
  return (
    <MemberSelectionContextProvider>
      <AuthorizationRolesSettings />
    </MemberSelectionContextProvider>
  );
};

export default AuthorizationRolesSettingsContainer;