import { FormattedMessage } from 'react-intl';

export const validateMaxLength = ({ value, length, message }) => (
  value?.length > length
    ? message || (
      <FormattedMessage
        id="ui-consortia-settings.validation.error.maxLength"
        values={{ length }}
      />
    )
    : undefined
);

export const validateMinLength = ({ value, length, message }) => (
  value?.length < length
    ? message || (
      <FormattedMessage
        id="ui-consortia-settings.validation.error.minLength"
        values={{ length }}
      />
    )
    : undefined
);

export const validateLength = ({ value, length, message }) => (
  value?.length !== length
    ? message || (
      <FormattedMessage
        id="ui-consortia-settings.validation.error.mismatchLength"
        values={{ length }}
      />
    )
    : undefined
);
