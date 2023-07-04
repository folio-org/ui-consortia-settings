import { FormattedMessage } from 'react-intl';

import {
  validateLength,
  validateMaxLength,
  validateUniqueness,
} from '../../components/ConsortiaControlledVocabulary/validators';
import {
  MAX_NAME_LENGTH,
  MAX_CODE_LENGTH,
} from './constants';

const validateMaxNameLength = (value = '') => (
  validateMaxLength({
    value,
    length: MAX_NAME_LENGTH,
    message: (
      <FormattedMessage
        id="ui-consortia-settings.settings.membership.error.nameExceedsLength"
        values={{ count: MAX_NAME_LENGTH }}
      />
    ),
  })
);

const validateCodeLength = (value = '') => (
  validateLength({
    value,
    length: MAX_CODE_LENGTH,
    message: (
      <FormattedMessage
        id="ui-consortia-settings.settings.membership.error.codeExceedsLength"
        values={{ count: MAX_CODE_LENGTH }}
      />
    ),
  })
);

const validateNameUniqueness = (item, index, items = []) => (
  validateUniqueness({
    index,
    item,
    items,
    field: 'name',
    message: <FormattedMessage id="ui-consortia-settings.settings.membership.error.duplicate" />,
  })
);

const validateCodeUniqueness = (item, index, items = []) => (
  validateUniqueness({
    index,
    item,
    items,
    field: 'code',
    message: <FormattedMessage id="ui-consortia-settings.settings.membership.error.duplicate.code" />,
  })
);

export const validate = (item, index, items) => {
  const { name, code } = item;

  const nameError = (
    validateMaxNameLength(name)
    || validateNameUniqueness(item, index, items)
    || undefined
  );

  const codeError = (
    validateCodeLength(code)
    || validateCodeUniqueness(item, index, items)
    || undefined
  );

  return {
    name: nameError,
    code: codeError,
  };
};
