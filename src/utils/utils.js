const NO_PERMISSIONS_MESSAGE_ID = 'ui-consortia-settings.errors.permissionsRequired';
const DEFAULT_MESSAGE_ID = 'ui-consortia-settings.errors.jobs.load.common';

export const handleErrorMessages = ({
  intl,
  response,
  messageId = DEFAULT_MESSAGE_ID,
  showCallout,
}) => {
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
};

export const isEurekaEnabled = (stripes) => stripes?.config?.isEureka;
