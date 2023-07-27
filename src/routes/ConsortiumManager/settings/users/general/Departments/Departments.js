import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { NoValue } from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { DEPARTMENTS_API } from '../../../../../../constants';
import {
  SETTINGS,
  SETTINGS_BACK_LINKS,
} from '../../../../constants';
import { validate } from './validate';

const FIELDS_MAP = {
  name: 'name',
  code: 'code',
  lastUpdated: 'lastUpdated',
  numberOfObjects: 'numberOfObjects',
};
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const FORMATTER = {
  numberOfObjects: item => item.usageNumber || <NoValue />,
};
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.departments');

const getColumnMapping = ({ intl }) => ({
  [FIELDS_MAP.name]: <FormattedMessage id="ui-users.settings.departments.name" />,
  [FIELDS_MAP.code]: <FormattedMessage id="ui-users.settings.departments.code" />,
  [FIELDS_MAP.numberOfObjects]: (
    <FormattedMessage
      id="stripes-smart-components.cv.numberOfObjects"
      values={{ objects: intl.formatMessage({ id: 'ui-users.settings.departments.users' }) }}
    />
  ),
});

const squashSharedSetting = (sharedSettingRecords) => {
  return sharedSettingRecords.reduce((acc, curr) => ({
    ...acc,
    ...curr,
    usageNumber: Number(acc.usageNumber || 0) + Number(curr.usageNumber || 0),
  }));
};

const actionSuppression = {
  delete: item => item.usageNumber,
  edit: () => false,
};

export const Departments = ({ stripes }) => {
  const intl = useIntl();
  const hasEditPerm = stripes.hasPerm('ui-users.settings.departments.edit');
  const hasDeletePerm = stripes.hasPerm('ui-users.settings.departments.delete');
  const hasCreatePerm = stripes.hasPerm('ui-users.settings.departments.create');

  const columnMapping = useMemo(() => getColumnMapping({ intl }), [intl]);

  return (
    <ConsortiaControlledVocabulary
      id="departments"
      firstMenu={SETTINGS_BACK_LINKS[SETTINGS.users]}
      actionSuppression={actionSuppression}
      columnMapping={columnMapping}
      formatter={FORMATTER}
      label={intl.formatMessage({ id: 'ui-users.departments' })}
      path={DEPARTMENTS_API}
      records="departments"
      squashSharedSetting={squashSharedSetting}
      translations={TRANSLATIONS}
      validate={validate}
      visibleFields={VISIBLE_FIELDS}
    />
  );
};

Departments.propTypes = {
  stripes: stripesShape,
};
