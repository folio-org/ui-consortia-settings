import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { flow } from 'lodash';

import {
  stripesConnect,
  TitleManager,
} from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  baseManifest,
  getControlledVocabTranslations,
  LoadingPane,
} from '@folio/stripes-acq-components';

import { withConsortium } from '../../withConsortium';
import {
  COLUMN_MAPPING,
  HIDDEN_FILEDS,
  READONLY_FIELDS,
  VISIBLE_FIELDS,
} from './constants';
import { validate } from './validate';

const Membership = ({
  stripes,
  resources,
  mutator,
  consortium,
}) => {
  const intl = useIntl();

  const paneTitle = intl.formatMessage({ id: 'ui-consortia-settings.settings.membership.heading' });

  const actionSuppressor = useMemo(() => ({
    edit: () => !stripes.hasPerm('consortia.tenants.item.put'),
    delete: () => true,
  }), [stripes]);

  if (consortium.isLoading) return <LoadingPane paneTitle={paneTitle} />;

  return (
    <>
      <TitleManager
        page={intl.formatMessage({ id: 'ui-consortia-settings.document.settings.title' })}
        record={intl.formatMessage({ id: 'ui-consortia-settings.settings.membership.label' })}
      />
      <ControlledVocab
        id="consortia-membership"
        actionSuppressor={actionSuppressor}
        canCreate={false}
        stripes={stripes}
        mutator={mutator}
        resources={resources}
        readOnlyFields={READONLY_FIELDS}
        baseUrl={`consortia/${consortium.id}/tenants`}
        records="tenants"
        label={paneTitle}
        objectLabel={intl.formatMessage({ id: 'ui-consortia-settings.settings.membership.objectLabel' })}
        translations={getControlledVocabTranslations('ui-consortia-settings.settings.membership.list')}
        columnMapping={COLUMN_MAPPING}
        hiddenFields={HIDDEN_FILEDS}
        visibleFields={VISIBLE_FIELDS}
        validate={validate}
      />
    </>
  );
};

Membership.manifest = Object.freeze({
  values: {
    ...baseManifest,
    path: 'consortia/!{consortium.id}/tenants',
    records: 'tenants',
    PUT: {
      path: 'consortia/!{consortium.id}/tenants/%{activeRecord.id}',
      headers: {
        accept: 'application/json',
      },
    },
  },
  updaterIds: [],
  activeRecord: {},
});

Membership.propTypes = {
  consortium: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default flow(
  stripesConnect,
  withConsortium,
)(Membership);
