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

import {
  ConsortiumManagerHeader,
  ConsortiumManagerNavigationPaneToggle,
} from '../../components';
import { useConsortiumManagerContext } from '../../contexts';
import { MODULE_ROOT_ROUTE } from '../../constants';
import { getModuleName } from '../../utils';
import {
  CONSORTIUM_MANAGER_SECTIONS_PANE_LABEL_ID,
  CONSORTIUM_MANAGER_SECTIONS_LABEL_IDS_MAP,
  CONSORTIUM_MANAGER_SECTIONS_MAP,
  MODULES_ROUTES_MAP,
} from './constants';

import css from './ConsortiumManager.css';

const ChooseSettings = () => (
  <div className={css.settingChoose}>
    <FormattedMessage id="stripes-core.settingChoose" />
  </div>
);

const PanePlaceholder = () => <div className={css.panePlaceholder} />;

const buildModulesLinks = (modules) => {
  return modules
    .filter(Boolean)
    .sort((x, y) => x.displayName.toLowerCase().localeCompare(y.displayName.toLowerCase()))
    .map(({ displayName, module: name, route }) => (
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
    ));
};

export const ConsortiumManager = ({ location }) => {
  const intl = useIntl();
  const modules = useModules();
  const stripes = useStripes();

  const { isNavigationPaneVisible } = useConsortiumManagerContext();

  const activeLink = `${MODULE_ROOT_ROUTE}/${location.pathname.split('/')[2]}`;

  const modulesMap = useMemo(() => (
    modules.settings.reduce((acc, m) => {
      const moduleName = getModuleName(m);
      const isModuleAvailable = Boolean(MODULES_ROUTES_MAP.get(moduleName));

      return isModuleAvailable ? acc.set(moduleName, m) : acc;
    }, new Map())
  ), [modules.settings]);

  const navListSections = useMemo(() => {
    return [...CONSORTIUM_MANAGER_SECTIONS_MAP.entries()].reduce((acc, [section, sectionModulesNames]) => {
      const sectionModules = sectionModulesNames?.map((moduleName) => modulesMap.get(moduleName));

      if (!sectionModules?.length) return acc;

      acc.push(
        <NavListSection
          key={section}
          activeLink={activeLink}
          label={intl.formatMessage({ id: CONSORTIUM_MANAGER_SECTIONS_LABEL_IDS_MAP.get(section) })}
          className={css.navListSection}
        >
          {buildModulesLinks(sectionModules)}
        </NavListSection>,
      );

      return acc;
    }, []);
  }, [activeLink, intl, modulesMap]);

  const routes = useMemo(() => (
    [...modulesMap.values()].map((m) => (
      <Route
        path={`${MODULE_ROOT_ROUTE}${m.route}`}
        key={m.route}
        render={(props) => {
          const Component = MODULES_ROUTES_MAP.get(getModuleName(m));

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
  ), [modulesMap, stripes]);

  return (
    <>
      <ConsortiumManagerHeader />
      <div className={css.managerContent}>
        <Paneset isRoot>
          {isNavigationPaneVisible && (
            <Pane
              defaultWidth="20%"
              paneTitle={<FormattedMessage id={CONSORTIUM_MANAGER_SECTIONS_PANE_LABEL_ID} />}
              id="settings-nav-pane"
              lastMenu={<ConsortiumManagerNavigationPaneToggle />}
            >
              <NavList aria-label={intl.formatMessage({ id: CONSORTIUM_MANAGER_SECTIONS_PANE_LABEL_ID })}>
                {navListSections}
              </NavList>
            </Pane>
          )}

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
