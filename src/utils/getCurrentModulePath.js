export const getCurrentModulePath = (modules, pathname) => {
  const { app, settings } = modules;

  const isSettings = pathname.startsWith('/settings');
  const targetList = isSettings ? settings : app;
  const formatRoute = (route) => (isSettings ? `/settings${route}` : route);

  return formatRoute(targetList.find(({ route }) => pathname.startsWith(formatRoute(route)))?.route || '/');
};
