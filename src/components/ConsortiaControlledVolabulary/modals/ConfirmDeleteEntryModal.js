import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

import { translationsShape } from '../../../shapes';

export const ConfirmDeleteEntryModal = ({
  onCancel,
  onConfirm,
  open,
  term,
  translations,
}) => {
  const { termWillBeDeleted, deleteEntry } = translations;

  return (
    <ConfirmationModal
      id="delete-controlled-vocab-entry-confirmation"
      open={open}
      heading={<FormattedMessage id={deleteEntry} />}
      message={(
        <FormattedMessage
          id={termWillBeDeleted}
          values={{ term }}
        />
      )}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
    />
  );
};

ConfirmDeleteEntryModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
  term: PropTypes.string.isRequired,
  translations: translationsShape.isRequired,
};
