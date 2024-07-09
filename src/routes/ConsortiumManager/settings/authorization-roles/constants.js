import { FormattedMessage } from 'react-intl';

export const COLUMN_NAMES = {
  description: 'description',
  name: 'name',
  updated: 'updated',
  updatedBy: 'updatedBy',
};

export const COLUMN_MAPPING = {
  [COLUMN_NAMES.name]: <FormattedMessage id="ui-authorization-roles.columns.name" />,
  [COLUMN_NAMES.description]: <FormattedMessage id="ui-authorization-roles.columns.description" />,
  [COLUMN_NAMES.updated]: <FormattedMessage id="ui-authorization-roles.columns.updatedDate" />,
  [COLUMN_NAMES.updatedBy]: <FormattedMessage id="ui-authorization-roles.columns.updatedBy" />,
};

export const VISIBLE_COLUMNS = [
  COLUMN_NAMES.name,
  COLUMN_NAMES.description,
  COLUMN_NAMES.updated,
  COLUMN_NAMES.updatedBy,
];
