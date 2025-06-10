import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import {
  RoleCreate,
  RoleEdit,
} from '@folio/stripes-authorization-components';
import { useStripes } from '@folio/stripes/core';

import { AffiliationLookupSuppressor } from '../../../../components';
import { AUTHORIZATION_ROLES_ROUTE } from '../../../../constants';
import { useMemberSelectionContext } from '../../MemberSelectionContext';
import { AuthorizationRolesViewPage } from './AuthorizationRolesViewPage';
import { CapabilitiesCompare } from './Capabilities';
import { UsersCapabilitiesCompare } from './UsersCapabilities';
import { hasInteractionRequiredInterfaces } from './utils';

export const AuthorizationRolesSettings = () => {
  const stripes = useStripes();

  const { activeMember } = useMemberSelectionContext();

  return (
    <Router>
      <Switch>
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/compare`}
          render={() => {
            return !hasInteractionRequiredInterfaces(stripes)
              ? <Redirect to={AUTHORIZATION_ROLES_ROUTE} />
              : <CapabilitiesCompare />;
          }}
        />
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/compare-users`}
          render={() => {
            return !hasInteractionRequiredInterfaces(stripes)
              ? <Redirect to={AUTHORIZATION_ROLES_ROUTE} />
              : <UsersCapabilitiesCompare />;
          }}
        />
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/create`}
          render={() => {
            if (!hasInteractionRequiredInterfaces(stripes)) {
              return <Redirect to={AUTHORIZATION_ROLES_ROUTE} />;
            }

            return (
              <AffiliationLookupSuppressor>
                <RoleCreate
                  tenantId={activeMember}
                  path={AUTHORIZATION_ROLES_ROUTE}
                />
              </AffiliationLookupSuppressor>
            );
          }}
        />
        <Route
          exact
          path={`${AUTHORIZATION_ROLES_ROUTE}/:id/edit`}
          render={() => {
            if (!hasInteractionRequiredInterfaces(stripes)) {
              return <Redirect to={AUTHORIZATION_ROLES_ROUTE} />;
            }

            return (
              <AffiliationLookupSuppressor>
                <RoleEdit
                  tenantId={activeMember}
                  path={AUTHORIZATION_ROLES_ROUTE}
                />
              </AffiliationLookupSuppressor>
            );
          }}
        />
        <Route
          path={`${AUTHORIZATION_ROLES_ROUTE}/:id?`}
          render={() => <AuthorizationRolesViewPage path={AUTHORIZATION_ROLES_ROUTE} />}
        />
      </Switch>
    </Router>
  );
};
