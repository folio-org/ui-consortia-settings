import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';

import { PolicyFormContainer } from '@folio/stripes-authorization-components';

import { AffiliationLookupSuppressor } from '../../../../components';
import { AUTHORIZATION_POLICIES_ROUTE } from '../../../../constants';
import { useMemberSelectionContext } from '../../MemberSelectionContext';
import { AuthorizationPoliciesView } from './AuthorizationPoliciesView';

export const AuthorizationPoliciesSettings = () => {
  const history = useHistory();
  const { activeMember } = useMemberSelectionContext();

  const onClose = () => {
    history.push(AUTHORIZATION_POLICIES_ROUTE);
  };

  return (
    <Router>
      <Switch>
        <Route
          exact
          path={`${AUTHORIZATION_POLICIES_ROUTE}/create`}
          render={() => (
            <AffiliationLookupSuppressor>
              <PolicyFormContainer
                onClose={onClose}
                path={AUTHORIZATION_POLICIES_ROUTE}
                tenantId={activeMember}
              />
            </AffiliationLookupSuppressor>
          )}
        />
        <Route
          exact
          path={`${AUTHORIZATION_POLICIES_ROUTE}/:id/edit`}
          render={() => (
            <AffiliationLookupSuppressor>
              <PolicyFormContainer
                onClose={onClose}
                path={AUTHORIZATION_POLICIES_ROUTE}
                tenantId={activeMember}
              />
            </AffiliationLookupSuppressor>
          )}
        />
        <Route
          exact
          path={`${AUTHORIZATION_POLICIES_ROUTE}/:id?`}
          component={AuthorizationPoliciesView}
        />
      </Switch>
    </Router>
  );
};
