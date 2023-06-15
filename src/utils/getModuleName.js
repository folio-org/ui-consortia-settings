import { PACKAGE_SCOPE_REGEX } from '../constants';

export const getModuleName = ({ module } = {}) => {
  return module?.replace(PACKAGE_SCOPE_REGEX, '');
};
