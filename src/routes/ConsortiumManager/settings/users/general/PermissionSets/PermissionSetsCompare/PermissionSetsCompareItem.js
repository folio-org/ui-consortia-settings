import React from 'react';
import { Selection, AccordionSet, Accordion, List } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';

const defaultOptions = [
  { value: 'AU', label: 'Australia' },
  { value: 'CN', label: 'China' },
  { value: 'DK', label: 'Denmark' },
  { value: 'MX', label: 'Mexico' },
  { value: 'SE', label: 'Sweden' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
];

export default function PermissionSetsCompareItem() {
  const intl = useIntl();

  const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];
  const itemFormatter = (item) => (<li>{item}</li>);
  const isEmptyMessage = <FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.empty" />;

  return (
    <div>
      <Selection
        name="member-library"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.memberLibrary" />}
        id="countrySelect"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.compare.memberLibrary.placeholder' })}
        dataOptions={defaultOptions}
      />
      <Selection
        name="permission-set"
        label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.permissionSet" />}
        id="permissionSet"
        placeholder={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.compare.permissionSet.placeholder' })}
        dataOptions={defaultOptions}
      />
      <AccordionSet>
        <Accordion
          id="accordion1"
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.permissionSets.compare.assignedPermissions" />}
        >
          <List
            items={items}
            itemFormatter={itemFormatter}
            isEmptyMessage={isEmptyMessage}
          />
        </Accordion>
      </AccordionSet>
    </div>
  );
}
