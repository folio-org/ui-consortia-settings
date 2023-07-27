import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { PATRON_GROUPS_API } from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';

const FIELDS_MAP = {
  group: 'group',
  desc: 'desc',
  expirationOffsetInDays: 'expirationOffsetInDays',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const COLUMN_MAPPING = {
  [FIELDS_MAP.group]: <FormattedMessage id="ui-users.information.patronGroup" />,
  [FIELDS_MAP.desc]: <FormattedMessage id="ui-users.description" />,
  [FIELDS_MAP.expirationOffsetInDays]: <FormattedMessage id="ui-users.information.patronGroup.expirationOffset" />,
  [FIELDS_MAP.lastUpdated]: <FormattedMessage id="stripes-smart-components.cv.lastUpdated" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.patronGroups');
const PERMISSIONS = {
  create: 'usergroups.item.post',
  delete: 'usergroups.item.delete',
  update: 'usergroups.item.put',
};

const isPositiveInteger = (n) => Number.isInteger(Number(n)) && Number.parseInt(n, 10) >= 1;
const isValidExpirationOffset = (n) => (n ? isPositiveInteger(n) : true);

const validateFields = ({ expirationOffsetInDays }) => ({
  expirationOffsetInDays: isValidExpirationOffset(expirationOffsetInDays)
    ? undefined
    : <FormattedMessage id="ui-users.information.patronGroup.expirationOffset.error" />,
});

export const PatronGroups = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="patrongroups"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.users]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-users.information.patronGroups' })}
      path={PATRON_GROUPS_API}
      permissions={PERMISSIONS}
      records="usergroups"
      translations={TRANSLATIONS}
      validate={validateFields}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
