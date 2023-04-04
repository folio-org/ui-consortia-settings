import { FormattedMessage } from 'react-intl';

import { MAX_NAME_LENGTH } from './constants';

const validateMaxNameLength = (name = '') => (
  name.length > MAX_NAME_LENGTH && (
    <FormattedMessage
      id="ui-consortia-settings.settings.membership.error.nameExceedsLength"
      values={{ count: MAX_NAME_LENGTH }}
    />
  )
);

const validateNameUniqueness = (name, i, items = []) => (
  items.some(({ name: _name }, _i) => (name === _name && i !== _i)) && (
    <FormattedMessage id="ui-consortia-settings.settings.membership.error.duplicate" />
  )
);

export const validate = ({ name }, i, items) => {
  const nameError = (
    validateMaxNameLength(name)
    || validateNameUniqueness(name, i, items)
    || undefined
  );

  return {
    name: nameError,
  };
};
