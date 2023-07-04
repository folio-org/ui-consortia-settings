import { FormattedMessage } from 'react-intl';

import {
  validateRequired,
  validateUniqueness,
} from '../../../../../../components/ConsortiaControlledVocabulary/validators';

export const validate = (item, index, items) => {
  const validateFieldUniqueness = (field, message) => validateUniqueness({
    index,
    item,
    items,
    field,
    message,
  });

  const nameError = validateFieldUniqueness('name', <FormattedMessage id="ui-users.settings.departments.name.error" />);

  const codeError = (
    validateRequired({
      value: item.code,
      message: <FormattedMessage id="ui-users.settings.departments.code.required" />,
    })
    || validateFieldUniqueness('code', <FormattedMessage id="ui-users.settings.departments.code.error" />)
  );

  return {
    name: nameError,
    code: codeError,
  };
};
