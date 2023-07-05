import { FormattedMessage, useIntl } from 'react-intl';

import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import {
  HOLDINGS_NOTE_TYPES_API,
  RECORD_SOURCE,
} from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';

const ITEM_TEMPLATE = { source: RECORD_SOURCE.LOCAL };
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
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.holdingsNoteTypes');

export const HoldingsNoteTypes = () => {
  const intl = useIntl();

  return (
    <ConsortiaControlledVocabulary
      id="holdings-note-types"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.inventory]}
      columnMapping={COLUMN_MAPPING}
      label={intl.formatMessage({ id: 'ui-inventory.holdingsNoteTypes' })}
      path={HOLDINGS_NOTE_TYPES_API}
      records="holdingsNoteTypes"
      translations={TRANSLATIONS}
      itemTemplate={ITEM_TEMPLATE}
      readOnlyFields={READONLY_FIELDS}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};
