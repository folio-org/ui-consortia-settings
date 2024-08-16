import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { EVENT_EMITTER_EVENTS } from '../../constants';
import { useEventEmitter } from '../../hooks';

export const AffiliationLookupSuppressor = ({ children }) => {
  const eventEmitter = useEventEmitter();

  useEffect(() => {
    eventEmitter.emit(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, true);

    return () => {
      eventEmitter.emit(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, false);
    };
  }, [eventEmitter]);

  return children;
};

AffiliationLookupSuppressor.propTypes = {
  children: PropTypes.node,
};
