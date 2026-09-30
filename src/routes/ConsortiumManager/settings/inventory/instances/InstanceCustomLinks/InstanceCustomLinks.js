import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { Checkbox, Layer, Paneset } from '@folio/stripes/components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { useCentralTenantSettingsCount } from '../../../../../../hooks/consortiumManager';
import { ConsortiaControlledVocabulary } from '../../../../../../components';
import { SETTINGS } from '../../../../constants';
import {
  INSTANCE_CUSTOM_LINKS_API,
  MODULE_ROOT_ROUTE,
} from '../../../../../../constants';
import { DEFAULT_ITEM_TEMPLATE } from '../../constants';

import css from './InstanceCustomLinks.css';

const formatHeader = (id) => {
  return (
    <>
      <FormattedMessage id={id} /> <span className={css.required}>*</span>
    </>
  );
};

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
  [FIELDS_MAP.name]: formatHeader('ui-inventory.name'),
  [FIELDS_MAP.linkText]: formatHeader('ui-inventory.linkText'),
  [FIELDS_MAP.link]: formatHeader('ui-inventory.link'),
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

const formatter = {
  'show': ({ show }) => (
    <div className={css.showField}>
      <Checkbox checked={show} disabled />
    </div>
  ),
};

const fieldComponents = {
  'show': ({ fieldProps }) => (
    <div className={css.showField}>
      <Field
        {...fieldProps}
        component={Checkbox}
        type="checkbox"
      />
    </div>
  ),
};

const validateName = (item) => {
  const errors = {};

  if (!item.name) {
    errors.name = <FormattedMessage id="ui-inventory.fillIn" />;
  }

  if (item?.name?.length > 150) {
    errors.name = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.nameTooLong" />;
  }

  return errors;
};

const patterns = /\{\{(UUID|HRID|indexTitle)\}\}/;

const validateLink = (item) => {
  const errors = {};

  if (!item.link) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkRequired" />;
  }

  if (item.link && !item.link.toLowerCase().startsWith('https://') && !item.link.toLowerCase().startsWith('http://')) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkProtocol" />;
  }

  if (item.link && !patterns.test(item.link) && item.link.includes('{{') && item.link.includes('}}')) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkParameter" />;
  }

  if (item?.link?.length > 1000) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTooLong" />;
  }

  return errors;
};

const validateLinkText = (item) => {
  const errors = {};

  if (!item.linkText) {
    errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextRequired" />;
  }

  if (item?.linkText?.length > 40) {
    errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextTooLong" />;
  }

  if (item?.linkText?.trim() === '') {
    errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextBlank" />;
  }

  return errors;
};

const validator = (item) => {
  const nameErrors = validateName(item);
  const linkTextErrors = validateLinkText(item);
  const linkErrors = validateLink(item);

  return {
    ...linkErrors,
    ...linkTextErrors,
    ...nameErrors,
  };
};

export const InstanceCustomLinks = () => {
  const intl = useIntl();
  const history = useHistory();
  const { count } = useCentralTenantSettingsCount(INSTANCE_CUSTOM_LINKS_API);

  const onClose = () => {
    history.push({
      pathname: `${MODULE_ROOT_ROUTE}/${SETTINGS.inventory}`,
    });
  };

  return (
    <Layer isOpen>
      <Paneset isRoot>
        <ConsortiaControlledVocabulary
          id="instance-custom-links"
          dismissible
          onClose={onClose}
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
          itemTemplate={{ ...DEFAULT_ITEM_TEMPLATE, show: true }}
          readOnlyFields={READONLY_FIELDS}
          uniqueFields={UNIQUE_FIELDS}
          validate={validator}
          visibleFields={VISIBLE_FIELDS}
          canCreate={count < LINK_LIMIT}
        />
      </Paneset>
    </Layer>
  );
};
