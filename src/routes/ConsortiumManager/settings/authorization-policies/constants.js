import { FormattedMessage } from 'react-intl';

export const COLUMN_NAMES = {
  name: 'name',
  description: 'description',
  updated: 'updated',
  updatedBy: 'updatedBy',
};

export const COLUMN_MAPPING = {
  [COLUMN_NAMES.name]: <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.name" />,
  [COLUMN_NAMES.description]: <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.description" />,
  [COLUMN_NAMES.updated]: <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.updatedDate" />,
  [COLUMN_NAMES.updatedBy]: <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.updatedBy" />,
};

export const VISIBLE_COLUMNS = [
  COLUMN_NAMES.name,
  COLUMN_NAMES.description,
  COLUMN_NAMES.updated,
  COLUMN_NAMES.updatedBy,
];
