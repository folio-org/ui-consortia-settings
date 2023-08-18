import { FormattedMessage } from 'react-intl';

import { validateRequired } from '../../../../../../components/ConsortiaControlledVocabulary/validators';

export const validate = (item) => {
  const codeError = validateRequired({
    value: item.code,
    message: <FormattedMessage id="ui-users.settings.departments.code.required" />,
  });

  return {
    code: codeError,
  };
};
