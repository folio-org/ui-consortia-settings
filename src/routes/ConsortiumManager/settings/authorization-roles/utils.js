import { FormattedDate } from "react-intl";

import { NoValue, TextLink } from "@folio/stripes/components";

export const getResultsFormatter = (path) => ({
  name: (item) => <TextLink to={`${path}/${item.id}`}>{item.name}</TextLink>,
  updatedBy: (item) => (item.metadata?.modifiedBy || <NoValue />),
  updated: (item) => (item.metadata?.modifiedDate ? <FormattedDate value={item.metadata?.modifiedDate} /> : <NoValue />),
});
