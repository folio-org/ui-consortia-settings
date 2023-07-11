import { FormattedMessage } from 'react-intl';

const DEFAULT_MESSAGE = <FormattedMessage id="stripes-core.label.missingRequiredField" />;

export const validateRequired = ({ value, message = DEFAULT_MESSAGE }) => (
  !value ? message : undefined
);
