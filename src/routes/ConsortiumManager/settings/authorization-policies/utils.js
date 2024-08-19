import { FormattedDate } from 'react-intl';

import { NoValue, TextLink } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import { COLUMN_NAMES } from './constants';

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
