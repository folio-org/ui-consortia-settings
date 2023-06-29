import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

export const FieldSharedEntry = ({ fieldProps, field, rowIndex }) => {
  const { values } = useFormState();
  const entryValues = get(values, [field, rowIndex]);

  const isEditing = Boolean(entryValues?.id);
  // TODO: check if the entry is a shared setting
  const isShared = false;

  return (
    <Field
      component={Checkbox}
      disabled={isEditing && isShared}
      label={<FormattedMessage id="ui-consortia-settings.share" />}
      type="checkbox"
      {...fieldProps}
    />
  );
};

FieldSharedEntry.propTypes = {
  field: PropTypes.string.isRequired,
  fieldProps: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  rowIndex: PropTypes.number.isRequired,
};
