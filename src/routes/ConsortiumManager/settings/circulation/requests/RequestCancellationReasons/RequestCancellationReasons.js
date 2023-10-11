import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { CANCELLATION_REASONS_API } from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';

const FIELDS_MAP = {
  name: 'name',
  description: 'description',
  publicDescription: 'publicDescription',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-circulation.settings.cancelReasons.labelShort" />,
  [FIELDS_MAP.description]: <FormattedMessage id="ui-circulation.settings.cancelReasons.descriptionInternal" />,
  [FIELDS_MAP.publicDescription]: <FormattedMessage id="ui-circulation.settings.cancelReasons.descriptionPublic" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-circulation.settings.cancelReasons');
const PERMISSIONS = {
  create: 'circulation-storage.cancellation-reasons.item.post',
  delete: 'circulation-storage.cancellation-reasons.item.delete',
  update: 'circulation-storage.cancellation-reasons.item.put',
};
const UNIQUE_FIELDS = [FIELDS_MAP.name];

const actionSuppression = {
  edit: () => false,
  delete: reason => reason.requiresAdditionalInformation,
};

export const RequestCancellationReasons = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="request-cancellation-reasons"
      columnMapping={COLUMN_MAPPING}
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.circulation]}
      label={intl.formatMessage({ id: 'ui-circulation.settings.cancelReasons.label' })}
      path={CANCELLATION_REASONS_API}
      permissions={PERMISSIONS}
      records="cancellationReasons"
      translations={TRANSLATIONS}
      actionSuppression={actionSuppression}
      uniqueFields={UNIQUE_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
