import { FormattedMessage } from 'react-intl';

export const MAX_NAME_LENGTH = 150;

export const COLUMN_MAPPING = {
  name: <FormattedMessage id="ui-consortia-settings.settings.membership.list.tenantName" />,
  id: <FormattedMessage id="ui-consortia-settings.settings.membership.list.tenantAddress" />,
};

export const HIDDEN_FILEDS = ['numberOfObjects', 'lastUpdated'];
export const READONLY_FIELDS = ['id'];
export const VISIBLE_FIELDS = ['name', 'id'];
