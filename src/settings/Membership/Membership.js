import { noop } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { tenants } from '../../../test/jest/fixtures/tenants';

/* TODO: replace mocks with actual resources during connecting with BE */
const mockedStripes = {
  connect: noop,
  hasPerm: noop,
};

const mockMutator = {
  values: {
    POST: noop,
  },
  updaterIds: {
    replace: noop,
  },
};

const mockResources = {
  values: { records: tenants },
};

const actionProps = {
  edit: () => ({ disabled: true }),
};

const suppressEdit = () => false;
/* ^^^ */

const columnMapping = {
  tenantName: <FormattedMessage id="ui-consortia-settings.settings.membership.list.tenantName" />,
  tenantId: <FormattedMessage id="ui-consortia-settings.settings.membership.list.tenantAddress" />,
};
const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const visibleFields = ['tenantName', 'tenantId'];

const suppressDelete = () => true;
const actionSuppressor = { edit: suppressEdit, delete: suppressDelete };

export const Membership = () => {
  const intl = useIntl();

  return (
    <ControlledVocab
      id="consortia-membership"
      actionProps={actionProps}
      actionSuppressor={actionSuppressor}
      canCreate={false}
      formType="final-form"
      stripes={mockedStripes}
      resources={mockResources}
      readOnlyFields={['tenantId']}
      mutator={mockMutator}
      // TODO: replace according to the contract during connecting with BE
      baseUrl="<REFINE endpoint>"
      records="<REFINE fieldName>"
      // ^^^
      label={intl.formatMessage({ id: 'ui-consortia-settings.settings.membership.heading' })}
      objectLabel={intl.formatMessage({ id: 'ui-consortia-settings.settings.membership.objectLabel' })}
      translations={getControlledVocabTranslations('ui-consortia-settings.settings.membership.list')}
      columnMapping={columnMapping}
      hiddenFields={hiddenFields}
      visibleFields={visibleFields}
    />
  );
};
