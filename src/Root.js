import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import { MODULE_ROOT_ROUTE } from './constants';
import { ConsortiumManager } from './routes';
import ConsortiumSettings from './settings';

const Root = ({
  location,
  match,
  showSettings,
}) => {
  if (showSettings) {
    return (
      <ConsortiumSettings
        location={location}
        match={match}
      />
    );
  }

  return (
    <Switch>
      <Route
        path={MODULE_ROOT_ROUTE}
        component={ConsortiumManager}
      />
    </Switch>
  );
};

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
