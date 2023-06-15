import ReactRouterPropTypes from 'react-router-prop-types';
import { Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

import {
  AppIcon,
  useModules,
  useStripes,
} from '@folio/stripes/core';
import {
  LoadingPane,
  NavList,
  NavListItem,
  NavListSection,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import { ConsortiumManagerHeader } from '../../components';
import { MODULE_ROOT_ROUTE } from '../../constants';
import { getModuleName } from '../../utils';
import { SETTINGS_ROUTES } from './constants';

import css from './ConsortiumManager.css';

const ChooseSettings = () => (
  <div className={css.settingChoose}>
    <FormattedMessage id="stripes-core.settingChoose" />
  </div>
);

const PanePlaceholder = () => <div className={css.panePlaceholder} />;

export const ConsortiumManager = ({ location }) => {
  const intl = useIntl();
  const modules = useModules();
  const stripes = useStripes();

  const activeLink = `${MODULE_ROOT_ROUTE}/${location.pathname.split('/')[2]}`;

  const settings = useMemo(() => (
    modules.settings
      .filter((m) => Boolean(SETTINGS_ROUTES[getModuleName(m)]))
      .sort((x, y) => x.displayName.toLowerCase().localeCompare(y.displayName.toLowerCase()))
  ), [modules.settings]);

  const navLinks = useMemo(() => (
    settings.map(({ displayName, module: name, route }) => (
      <NavListItem
        key={route}
        to={`${MODULE_ROOT_ROUTE}${route}`}
      >
        <AppIcon
          alt={displayName}
          app={name}
          size="small"
        >
          {displayName}
        </AppIcon>
      </NavListItem>
    ))
  ), [settings]);

  const routes = useMemo(() => (
    settings.map((m) => (
      <Route
        path={`${MODULE_ROOT_ROUTE}${m.route}`}
        key={m.route}
        render={(props) => {
          const Component = SETTINGS_ROUTES[getModuleName(m)];

          return (
            <>
              <Component stripes={stripes} {...props} />
              {/* eslint-disable-next-line react/prop-types */}
              {props.match.isExact ? <PanePlaceholder /> : null}
            </>
          );
        }}
      />
    ))
  ), [settings, stripes]);

  return (
    <>
      <ConsortiumManagerHeader />
      <div className={css.managerContent}>
        <Paneset isRoot>
          <Pane
            defaultWidth="20%"
            paneTitle={<FormattedMessage id="stripes-core.settings" />}
            id="settings-nav-pane"
          >
            <NavList aria-label={intl.formatMessage({ id: 'stripes-core.settings' })}>
              <NavListSection
                activeLink={activeLink}
                label={intl.formatMessage({ id: 'stripes-core.settings' })}
                className={css.navListSection}
              >
                {navLinks}
              </NavListSection>
            </NavList>
          </Pane>
          <Suspense
            fallback={(
              <>
                <LoadingPane defaultWidth="30%" />
                <PanePlaceholder />
              </>
            )}
          >
            <Switch>
              {routes}
              <Route component={ChooseSettings} />
            </Switch>
          </Suspense>
        </Paneset>
      </div>
    </>
  );
};

ConsortiumManager.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};
