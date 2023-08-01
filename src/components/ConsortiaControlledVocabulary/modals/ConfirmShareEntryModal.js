import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const ConfirmShareEntryModal = ({
  open,
  onConfirm,
  onCancel,
  term,
}) => {
  return (
    <ConfirmationModal
      id="delete-controlled-vocab-entry-confirmation"
      open={open}
      heading={<FormattedMessage id="ui-consortia-settings.consortiumManager.modal.confirmShare.all.heading" />}
      message={(
        <FormattedMessage
          id="ui-consortia-settings.consortiumManager.modal.confirmShare.all.message"
          values={{ term }}
        />
      )}
      onConfirm={onConfirm}
      onCancel={onCancel}
      cancelLabel={<FormattedMessage id="stripes-form.keepEditing" />}
      confirmLabel={<FormattedMessage id="ui-consortia-settings.confirm" />}
    />
  );
};
