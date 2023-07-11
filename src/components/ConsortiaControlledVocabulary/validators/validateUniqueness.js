import { FormattedMessage } from 'react-intl';

export const validateUniqueness = ({
  index,
  item,
  items,
  field,
  message,
}) => (
  items.some((entry, i) => (item[field]?.toLocaleLowerCase() === entry[field]?.toLocaleLowerCase() && i !== index))
    ? message || (
      <FormattedMessage
        id="stripes-smart-components.error.name.duplicate"
        values={{ fieldLabel: field }}
      />
    )
    : undefined
);
