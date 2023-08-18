import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ConfirmationModal,
  List,
} from '@folio/stripes/components';

export const ConfirmCreateEntryModal = ({
  onCancel,
  onConfirm,
  open,
  term,
  members,
}) => {
  const message = (
    <>
      <FormattedMessage
        id="ui-consortia-settings.consortiumManager.modal.confirmCreate.message"
        values={{ term }}
      />
      <List
        listStyle="bullets"
        items={members}
        marginBottom0
      />
    </>
  );

  return (
    <ConfirmationModal
      id="create-controlled-vocab-entry-confirmation"
      open={open}
      heading={<FormattedMessage id="ui-consortia-settings.consortiumManager.modal.confirmCreate.heading" />}
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      cancelLabel={<FormattedMessage id="stripes-form.keepEditing" />}
      confirmLabel={<FormattedMessage id="ui-consortia-settings.button.confirm" />}
    />
  );
};

ConfirmCreateEntryModal.propTypes = {
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
  term: PropTypes.string.isRequired,
};
