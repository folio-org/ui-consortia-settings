import {
  coreEvents,
} from '@folio/stripes/core';

import { handleChangeAffilication } from './handleChangeAffilication';
import { handleLogin } from './handleLogin';
import { handleLoginError } from './handleLoginError';

export const HANDLERS = {
  [coreEvents.LOGIN]: stripes => {
    handleLogin(stripes)
      .catch(() => {});
  },
  [coreEvents.LOGIN_ERROR]: handleLoginError,
  CHANGE_ACTIVE_AFFILIATION: handleChangeAffilication,
};
