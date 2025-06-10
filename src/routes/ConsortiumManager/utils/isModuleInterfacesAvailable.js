import { MODULES_REQUIRED_INTERFACES_MAP } from '../constants';

export const isModuleInterfacesAvailable = (stripes, moduleName) => {
  const moduleInterfacesConfig = MODULES_REQUIRED_INTERFACES_MAP.get(moduleName);
  const moduleRequiredInterfaces = moduleInterfacesConfig?.interfaces;

  if (!moduleRequiredInterfaces?.length) {
    return true;
  }

  return moduleInterfacesConfig.requireAll
    ? moduleRequiredInterfaces.every((interfaceName) => stripes.hasInterface(interfaceName))
    : moduleRequiredInterfaces.some((interfaceName) => stripes.hasInterface(interfaceName));
};
