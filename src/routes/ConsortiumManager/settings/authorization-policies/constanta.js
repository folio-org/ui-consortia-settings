import { FormattedDate, FormattedMessage } from 'react-intl';

import { NoValue, TextLink } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

const COLUMN_NAMES = {
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

export const getResultsFormatter = ({ users }) => ({
  [COLUMN_NAMES.name]: (item) => <TextLink>{item.name}</TextLink>,
  [COLUMN_NAMES.updatedBy]: (item) => (item.metadata.updatedByUserId
    ? getFullName(users[item.metadata.updatedByUserId])
    : <NoValue />
  ),
  [COLUMN_NAMES.updated]: (item) => (item.metadata.updatedDate
    ? <FormattedDate value={item.metadata.updatedDate} />
    : <NoValue />
  ),
});
