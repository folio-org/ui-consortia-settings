import { FormattedMessage } from 'react-intl';

const isInitiallyShared = (item, initialValues) => Boolean(
  initialValues.find(({ id, tenantId }) => id === item.id && tenantId === item.tenantId)?.shared,
);

export const validateUniqueness = ({
  index,
  item,
  items,
  field,
  message,
  initialValues = [],
}) => {
  return (
    items.some((entry, i) => (
      i !== index
      && item[field]?.toLocaleLowerCase() === entry[field]?.toLocaleLowerCase()
      && (
        // If an existing entry is not initially shared, it must be unique within the tenant in which it exists.
        !item.id
        || (item.id && !item.shared && item.tenantId === entry.tenantId)
        || (item.id && item.shared && isInitiallyShared(item, initialValues))
      )
    ))
      ? message || (
        <FormattedMessage
          id="stripes-smart-components.error.name.duplicate"
          values={{ fieldLabel: field }}
        />
      )
      : undefined
  );
};
