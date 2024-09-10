import { FormattedDate } from 'react-intl';

import { NoValue, TextLink } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

export const getResultsFormatter = (path, users) => ({
  name: (item) => <TextLink to={`${path}/${item.id}`}>{item.name}</TextLink>,
  updatedBy: (item) => (item.metadata.updatedByUserId
    ? getFullName(users[item.metadata.updatedByUserId])
    : <NoValue />
  ),
  updated: (item) => (
    item.metadata?.updatedDate
      ? <FormattedDate value={item.metadata?.updatedDate} />
      : <NoValue />
  ),
});

export const onFilter = (value, dataOptions) => {
  return dataOptions.filter(option => new RegExp(value, 'i').test(option.label));
};
