import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { MODULE_ROOT_ROUTE, PERMISSION_SET_ROUTES } from './constants';
import { ConsortiumManagerContextProvider } from './contexts';
import { eventHandler } from './eventHandler';
import { ConsortiumManager } from './routes';
import ConsortiumSettings from './settings';
import { checkConsortiumAffiliations } from './utils';
import { PermissionSetsCompare } from './routes/ConsortiumManager/settings/users';

class Root extends React.Component {
  // Checks whether to show "Switch active affiliation" action item in the profile dropdown (package.json::stripes.links.userDropdown[0])
  static checkConsortiumAffiliations = checkConsortiumAffiliations;

  // Implementation of the handler specified in package.json ("stripes.handlerName")
  static eventHandler = eventHandler;

  render() {
    const {
      location,
      match,
      showSettings,
    } = this.props;

    if (showSettings) {
      return (
        <ConsortiumSettings
          location={location}
          match={match}
        />
      );
    }

    return (
      <ConsortiumManagerContextProvider>
        <Switch>
          <Route
            path={PERMISSION_SET_ROUTES.COMPARE}
            component={PermissionSetsCompare}
          />
          <Route
            path={MODULE_ROOT_ROUTE}
            component={ConsortiumManager}
          />
        </Switch>
      </ConsortiumManagerContextProvider>
    );
  }
}

Root.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  showSettings: PropTypes.bool.isRequired,
};

export default Root;
