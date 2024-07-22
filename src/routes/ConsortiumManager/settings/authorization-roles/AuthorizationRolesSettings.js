import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import { RoleCreate, RoleEdit } from '@folio/stripes-authorization-components';

import { AUTHORIZATION_ROLES_ROUTE } from '../../../../constants';
import { AuthorizationRolesViewPage } from './AuthorizationRolesViewPage';
import { CapabilitiesCompare } from './Capabilities';
import { UsersCapabilitiesCompare } from './UsersCapabilities';

const AuthorizationRolesSettings = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={`${AUTHORIZATION_ROLES_ROUTE}/compare`} component={CapabilitiesCompare} />
        <Route exact path={`${AUTHORIZATION_ROLES_ROUTE}/create`} render={() => <RoleCreate path={AUTHORIZATION_ROLES_ROUTE} />} />
        <Route exact path={`${AUTHORIZATION_ROLES_ROUTE}/:id/edit`} render={() => <RoleEdit path={AUTHORIZATION_ROLES_ROUTE} />} />
        <Route exact path={`${AUTHORIZATION_ROLES_ROUTE}/compareUsers`} component={UsersCapabilitiesCompare} />
        <Route path={`${AUTHORIZATION_ROLES_ROUTE}/:id?`} render={() => <AuthorizationRolesViewPage path={AUTHORIZATION_ROLES_ROUTE} />} />
      </Switch>
    </Router>
  );
};

export default AuthorizationRolesSettings;
