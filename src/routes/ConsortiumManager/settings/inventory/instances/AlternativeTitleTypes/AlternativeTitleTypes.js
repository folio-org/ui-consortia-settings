import { FormattedMessage, useIntl } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  ALTERNATIVE_TITLE_TYPES_API,
  RECORD_SOURCE,
} from '../../../../../../constants';

const FIELDS_MAP = {
  name: 'name',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const READONLY_FIELDS = [FIELDS_MAP.source];
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};

export const AlternativeTitleTypes = ({ stripes }) => {
  const intl = useIntl();
  const hasPerm = stripes.hasPerm('ui-inventory.settings.alternative-title-types');

  return (
    <ConsortiaControlledVocabulary
      id="alternative-title-types"
      editable={hasPerm}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.alternativeTitleTypes' })}
      path={ALTERNATIVE_TITLE_TYPES_API}
      records="alternativeTitleTypes"
      translations={getControlledVocabTranslations('ui-circulation.settings.cancelReasons')}
      itemTemplate={{ source: RECORD_SOURCE.LOCAL }}
      readOnlyFields={READONLY_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};

AlternativeTitleTypes.propTypes = {
  stripes: stripesShape,
};
