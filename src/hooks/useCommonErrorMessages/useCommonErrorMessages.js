import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { useShowCallout } from '@folio/stripes-acq-components';

const NO_PERMISSIONS_MESSAGE_ID = 'ui-consortia-settings.errors.permissionsRequired';
const DEFAULT_MESSAGE_ID = 'ui-consortia-settings.errors.jobs.load.common';

export const useCommonErrorMessages = () => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const handleErrorMessages = useCallback(({ response, messageId = DEFAULT_MESSAGE_ID }) => {
    const defaultMessage = intl.formatMessage({ id: messageId });

    if (response?.status === 403) {
      return showCallout({
        message: `${defaultMessage} ${intl.formatMessage({ id: NO_PERMISSIONS_MESSAGE_ID })}`,
        type: 'error',
      });
    }

    return showCallout({
      message: defaultMessage,
      type: 'error',
    });
  }, [intl, showCallout]);

  return {
    handleErrorMessages,
  };
};
