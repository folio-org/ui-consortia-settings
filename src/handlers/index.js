import {
  coreEvents,
} from '@folio/stripes/core';

import { handleLogin } from './handleLogin';
import { handleChangeAffilication } from './handleChangeAffilication';

export const HANDLERS = {
  [coreEvents.LOGIN]: stripes => {
    handleLogin(stripes);
  },
  CHANGE_ACTIVE_AFFILIATION: handleChangeAffilication,
};
