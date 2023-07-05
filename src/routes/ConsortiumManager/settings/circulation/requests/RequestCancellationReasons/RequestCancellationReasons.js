import { FormattedMessage, useIntl } from 'react-intl';

import { Label } from '@folio/stripes/components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { CANCELLATION_REASONS_API } from '../../../../../../constants';

const FIELDS_MAP = {
  name: 'name',
  description: 'description',
  publicDescription: 'publicDescription',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: (
    <Label required>
      <FormattedMessage id="ui-circulation.settings.cancelReasons.labelShort" />
    </Label>
  ),
  [FIELDS_MAP.description]: <FormattedMessage id="ui-circulation.settings.cancelReasons.descriptionInternal" />,
  [FIELDS_MAP.publicDescription]: <FormattedMessage id="ui-circulation.settings.cancelReasons.descriptionPublic" />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-circulation.settings.cancelReasons');

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
      label={intl.formatMessage({ id: 'ui-circulation.settings.cancelReasons.label' })}
      path={CANCELLATION_REASONS_API}
      records="cancellationReasons"
      translations={TRANSLATIONS}
      actionSuppression={actionSuppression}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
