import { FormattedMessage } from 'react-intl';

export const validate = (item, index, items) => {
  const filteredDepartments = items.filter((department, i) => i !== index);
  const errors = {};

  // existing departent matches name
  if (filteredDepartments.find(department => department.name === item.name)) {
    errors.name = <FormattedMessage id="ui-users.settings.departments.name.error" />;
  }

  // existing departent matches name
  if (filteredDepartments.find(department => department.code === item.code)) {
    errors.code = <FormattedMessage id="ui-users.settings.departments.code.error" />;
  }

  // code is missing
  if (!item.code) {
    errors.code = <FormattedMessage id="ui-users.settings.departments.code.required" />;
  }

  return errors;
};
