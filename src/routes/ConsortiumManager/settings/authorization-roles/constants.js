import { FormattedMessage } from 'react-intl';

import { BE_INTERFACE } from '../../../../constants';

export const COLUMN_NAMES = {
  description: 'description',
  name: 'name',
  type: 'type',
  updated: 'updated',
  updatedBy: 'updatedBy',
};

export const COLUMN_MAPPING = {
  [COLUMN_NAMES.name]: <FormattedMessage id="stripes-authorization-components.columns.name" />,
  [COLUMN_NAMES.description]: <FormattedMessage id="stripes-authorization-components.columns.description" />,
  [COLUMN_NAMES.type]: <FormattedMessage id="stripes-authorization-components.columns.type" />,
  [COLUMN_NAMES.updated]: <FormattedMessage id="stripes-authorization-components.columns.updatedDate" />,
  [COLUMN_NAMES.updatedBy]: <FormattedMessage id="stripes-authorization-components.columns.updatedBy" />,
};

export const VISIBLE_COLUMNS = [
  COLUMN_NAMES.name,
  COLUMN_NAMES.description,
  COLUMN_NAMES.type,
  COLUMN_NAMES.updated,
  COLUMN_NAMES.updatedBy,
];

export const INTERACTION_REQUIRED_INTERFACES = [
  BE_INTERFACE.CAPABILITIES,
  BE_INTERFACE.CAPABILITY_SETS,
  BE_INTERFACE.ROLE_CAPABILITIES,
  BE_INTERFACE.ROLE_CAPABILITY_SETS,
  BE_INTERFACE.ROLES_USER,
];
