import {
  coreEvents,
} from '@folio/stripes/core';

import { handleLogin } from './handleLogin';
import { handleChangeAffiliation } from './handleChangeAffiliation';

export const HANDLERS = {
  [coreEvents.LOGIN]: stripes => {
    handleLogin(stripes)
      .catch(() => {});
  },
  CHANGE_ACTIVE_AFFILIATION: handleChangeAffiliation,
};
