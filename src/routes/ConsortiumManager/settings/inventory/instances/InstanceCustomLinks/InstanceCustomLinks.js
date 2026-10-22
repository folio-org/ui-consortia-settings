import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { Checkbox, Icon, Layer, Paneset } from '@folio/stripes/components';
import {
  getControlledVocabTranslations,
  validateCustomLink,
} from '@folio/stripes-acq-components';

import { useCentralTenantSettingsCount } from '../../../../../../hooks/consortiumManager';
import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { SETTINGS } from '../../../../constants';
import {
  INSTANCE_CUSTOM_LINKS_API,
  MODULE_ROOT_ROUTE,
} from '../../../../../../constants';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

import css from './InstanceCustomLinks.css';

const LINK_LIMIT = 10;
const FIELDS_MAP = {
  name: 'name',
  linkText: 'linkText',
  link: 'link',
  show: 'show',
  source: 'source',
  lastUpdated: 'lastUpdated',
};
const COLUMN_MAPPING = {
  [FIELDS_MAP.name]: <FormattedMessage id="ui-inventory.name" />,
  [FIELDS_MAP.linkText]: <FormattedMessage id="ui-inventory.linkText" />,
  [FIELDS_MAP.link]: <FormattedMessage id="ui-inventory.link" />,
  [FIELDS_MAP.show]: <FormattedMessage id="ui-inventory.show" />,
  [FIELDS_MAP.source]: <FormattedMessage id="ui-inventory.source" />,
};
const COLUMN_WIDTHS = {
  name: '12%',
  linkText: '12%',
  link: '20%',
  show: '5%',
  lastUpdated: '12%',
};
const UNIQUE_FIELDS = [FIELDS_MAP.name, FIELDS_MAP.linkText, FIELDS_MAP.link];
const READONLY_FIELDS = [FIELDS_MAP.source];
const VISIBLE_FIELDS = Object.values(FIELDS_MAP);
const TRANSLATIONS = getControlledVocabTranslations('ui-consortia-settings.consortiumManager.controlledVocab.instanceCustomLinks');
const PERMISSIONS = {
  create: 'inventory-storage.instance-custom-links.item.post',
  delete: 'inventory-storage.instance-custom-links.item.delete',
  update: 'inventory-storage.instance-custom-links.item.put',
};
const LINK_ITEM_TEMPLATE = { ...DEFAULT_ITEM_TEMPLATE, [FIELDS_MAP.show]: true };

const getFormatter = (intl) => ({
  [FIELDS_MAP.show]: ({ show }) => (
    show ?
      <div className={css.showField} data-testid="formatter-column-show">
        <Icon icon="check-circle" aria-label={intl.formatMessage({ id: 'ui-inventory.show' })} />
      </div>
      :
      null
  ),
});

const fieldComponents = {
  [FIELDS_MAP.show]: ({ fieldProps }) => (
    <div className={css.showField}>
      <Field
        {...fieldProps}
        component={Checkbox}
        type="checkbox"
      />
    </div>
  ),
};

export const InstanceCustomLinks = () => {
  const intl = useIntl();
  const history = useHistory();
  // The central tenant's total custom link count is used as a stand-in for overall
  // tenant custom link availability - so long as there's room for more links in the
  // central tenant, assume most other tenants also have room.
  const {
    count,
    isLoading,
    refetch: refetchCount,
  } = useCentralTenantSettingsCount(INSTANCE_CUSTOM_LINKS_API);

  // Due to the width of the link field, make this pane full-width. Provide a
  // way to close the pane instead of firstMenu, which is responsive and is only
  // conditionally visible.
  const onClose = () => {
    history.push(`${MODULE_ROOT_ROUTE}/${SETTINGS.inventory}`);
  };

  const formatter = useMemo(() => getFormatter(intl), [intl]);

  return (
    <Layer isOpen>
      <Paneset isRoot>
        <ConsortiaControlledVocabulary
          id="instance-custom-links"
          dismissible
          onClose={onClose}
          onEntriesChange={refetchCount}
          columnMapping={COLUMN_MAPPING}
          columnWidths={COLUMN_WIDTHS}
          fieldComponents={fieldComponents}
          formatter={formatter}
          label={intl.formatMessage({ id: 'ui-inventory.instanceCustomLinks' })}
          path={INSTANCE_CUSTOM_LINKS_API}
          permissions={PERMISSIONS}
          records="instanceCustomLinks"
          sortby="name"
          translations={TRANSLATIONS}
          itemTemplate={LINK_ITEM_TEMPLATE}
          readOnlyFields={READONLY_FIELDS}
          uniqueFields={UNIQUE_FIELDS}
          validate={validateCustomLink}
          visibleFields={VISIBLE_FIELDS}
          canCreate={!isLoading && count < LINK_LIMIT}
        />
      </Paneset>
    </Layer>
  );
};
