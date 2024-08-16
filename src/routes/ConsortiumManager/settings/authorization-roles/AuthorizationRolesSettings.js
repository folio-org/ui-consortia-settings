import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import {
  RoleCreate,
  RoleEdit,
} from '@folio/stripes-authorization-components';

import { AffiliationLookupSuppressor } from '../../../../components';
import { AUTHORIZATION_ROLES_ROUTE } from '../../../../constants';
import { useMemberSelectionContext } from '../../MemberSelectionContext';
import { AuthorizationRolesViewPage } from './AuthorizationRolesViewPage';
import { CapabilitiesCompare } from './Capabilities';

export const AuthorizationRolesSettings = () => {
  const { activeMember } = useMemberSelectionContext();

  return (
    <Router>
      <Switch>
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/compare`}
          component={CapabilitiesCompare}
        />
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/create`}
          render={() => (
            <AffiliationLookupSuppressor>
              <RoleCreate
                tenantId={activeMember}
                path={AUTHORIZATION_ROLES_ROUTE}
              />
            </AffiliationLookupSuppressor>
          )}
        />
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/:id/edit`}
          render={() => (
            <AffiliationLookupSuppressor>
              <RoleEdit
                tenantId={activeMember}
                path={AUTHORIZATION_ROLES_ROUTE}
              />
            </AffiliationLookupSuppressor>
          )}
        />
        <Route
          path={`${AUTHORIZATION_ROLES_ROUTE}/:id?`}
          render={() => <AuthorizationRolesViewPage path={AUTHORIZATION_ROLES_ROUTE} />}
        />
      </Switch>
    </Router>
  );
};
