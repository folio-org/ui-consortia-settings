import { FormattedMessage } from 'react-intl';
import {
  MAX_NAME_LENGTH,
  MAX_CODE_LENGTH,
} from './constants';

const validateMaxNameLength = (name = '') => (
  name.length > MAX_NAME_LENGTH && (
    <FormattedMessage
      id="ui-consortia-settings.settings.membership.error.nameExceedsLength"
      values={{ count: MAX_NAME_LENGTH }}
    />
  )
);

const validateMaxCodeLength = (code = '') => (
  code.length !== MAX_CODE_LENGTH && (
    <FormattedMessage
      id="ui-consortia-settings.settings.membership.error.codeExceedsLength"
      values={{ count: MAX_CODE_LENGTH }}
    />
  )
);

const validateNameUniqueness = (name, i, items = []) => (
  items.some(({ name: _name }, _i) => (name === _name && i !== _i)) && (
    <FormattedMessage id="ui-consortia-settings.settings.membership.error.duplicate" />
  )
);

const validateCodeUniqueness = (code, i, items = []) => (
  items.some(({ code: _code }, _i) => (code.toLowerCase() === _code.toLowerCase() && i !== _i)) && (
    <FormattedMessage id="ui-consortia-settings.settings.membership.error.duplicate.code" />
  )
);

export const validate = ({ name, code }, i, items) => {
  const nameError = (
    validateMaxNameLength(name)
    || validateNameUniqueness(name, i, items)
    || undefined
  );

  const codeError = (
    validateMaxCodeLength(code)
    || validateCodeUniqueness(code, i, items)
    || undefined
  );

  return {
    name: nameError,
    code: codeError,
  };
};
